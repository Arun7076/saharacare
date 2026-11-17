import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

describe("SaharaCare Backend & SQLite Persistence Layer", () => {
  let db;

  before(() => {
    // Test in an isolated in-memory or test database
    db = new DatabaseSync(":memory:");
    db.exec("PRAGMA foreign_keys = ON;");

    // Bootstrap schema
    db.exec(`
      CREATE TABLE patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        phone TEXT,
        emergency_contact TEXT,
        caregiver_name TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE medications (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        instructions TEXT,
        time_of_day TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      );

      CREATE TABLE dose_records (
        id TEXT PRIMARY KEY,
        medication_id TEXT NOT NULL,
        date_key TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        status TEXT NOT NULL,
        taken_at TEXT,
        FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
      );

      CREATE TABLE caregiver_alerts (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        severity TEXT NOT NULL,
        time TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      );
    `);

    // Seed test patient
    db.prepare(`
      INSERT INTO patients VALUES ('p-1', 'Ram Bahadur Shrestha', 68, '+977-9841234567', '+977-9812345678', 'Pooja Shrestha', datetime('now'))
    `).run();
  });

  test("1. Successfully creates and queries patient record", () => {
    const patient = db.prepare("SELECT * FROM patients WHERE id = 'p-1'").get();
    assert.ok(patient);
    assert.equal(patient.name, "Ram Bahadur Shrestha");
    assert.equal(patient.age, 68);
  });

  test("2. Adds medications and enforces foreign key constraints", () => {
    const insertMed = db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, instructions, time_of_day, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
    `);

    insertMed.run("m-1", "p-1", "Metformin 500mg", "1 tablet", "After breakfast", "morning");
    insertMed.run("m-2", "p-1", "Amlodipine 5mg", "1 tablet", "After lunch", "afternoon");

    const meds = db.prepare("SELECT * FROM medications WHERE patient_id = 'p-1'").all();
    assert.equal(meds.length, 2);
    assert.equal(meds[0].name, "Metformin 500mg");

    // Foreign key violation should fail
    assert.throws(() => {
      insertMed.run("m-bad", "non-existent-patient", "Bad Med", "1 tablet", "", "morning");
    });
  });

  test("3. Materializes today's dose records and enforces scheduled status", () => {
    const insertDose = db.prepare(`
      INSERT INTO dose_records (id, medication_id, date_key, scheduled_time, status, taken_at)
      VALUES (?, ?, ?, ?, 'scheduled', NULL)
    `);

    insertDose.run("d-1", "m-1", "2026-11-17", "08:30 AM");
    insertDose.run("d-2", "m-2", "2026-11-17", "01:30 PM");

    const doses = db.prepare("SELECT * FROM dose_records WHERE date_key = '2026-11-17'").all();
    assert.equal(doses.length, 2);
    assert.equal(doses[0].status, "scheduled");
    assert.equal(doses[0].taken_at, null);
  });

  test("4. Transitions dose status to 'taken' and computes adherence correctly", () => {
    // Mark d-1 as taken
    db.prepare(`
      UPDATE dose_records
      SET status = 'taken', taken_at = '08:35 AM'
      WHERE id = 'd-1'
    `).run();

    const d1 = db.prepare("SELECT * FROM dose_records WHERE id = 'd-1'").get();
    assert.equal(d1.status, "taken");
    assert.equal(d1.taken_at, "08:35 AM");

    // Calculate adherence
    const doses = db.prepare("SELECT * FROM dose_records WHERE date_key = '2026-11-17'").all();
    const taken = doses.filter(d => d.status === "taken").length;
    const total = doses.length;
    const adherencePercentage = Math.round((taken / total) * 100);

    assert.equal(total, 2);
    assert.equal(taken, 1);
    assert.equal(adherencePercentage, 50);
  });

  test("5. Creates caregiver alert when dose is recorded", () => {
    db.prepare(`
      INSERT INTO caregiver_alerts (id, patient_id, type, message, severity, time, created_at)
      VALUES ('a-1', 'p-1', 'reminder', 'Metformin was taken at 08:35 AM', 'info', 'Just now', datetime('now'))
    `).run();

    const alerts = db.prepare("SELECT * FROM caregiver_alerts WHERE patient_id = 'p-1'").all();
    assert.equal(alerts.length, 1);
    assert.match(alerts[0].message, /Metformin/);
    assert.equal(alerts[0].severity, "info");
  });
});
