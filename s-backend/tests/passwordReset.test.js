const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const controller = require('../controllers/passwordResetController');
const invoke = (handler, body) => new Promise((resolve, reject) => handler({ body }, { json: resolve }, reject));
test('student and teacher reset consumes hash atomically and invalidates JWT version', async () => {
  for (const [role, Model] of [['Student', Student], ['Teacher', Teacher]]) {
    const original = Model.findOneAndUpdate;
    let used = false;
    Model.findOneAndUpdate = async (filter, update) => {
      assert.equal(filter.resetHash, crypto.createHash('sha256').update('a'.repeat(64)).digest('hex'));
      assert.ok(filter.resetExpires.$gt instanceof Date);
      assert.equal(await bcrypt.compare('Test-password-456', update.$set.password), true);
      assert.equal(update.$inc.tokenVersion, 1);
      assert.equal(update.$unset.resetHash, 1);
      if (used) return null;
      used = true;
      return { _id: '507f1f77bcf86cd799439011' };
    };
    try {
      const body = { role, token: 'a'.repeat(64), newPassword: 'Test-password-456' };
      assert.match((await invoke(controller.reset, body)).message, /Password updated/);
      await assert.rejects(invoke(controller.reset, body), /Invalid or expired/);
    } finally { Model.findOneAndUpdate = original; }
  }
});
test('malformed reset tokens rejected', async () => {
  await assert.rejects(invoke(controller.reset, { role: 'Student', token: 'bad', newPassword: 'test-password' }), /Invalid or expired/);
});
