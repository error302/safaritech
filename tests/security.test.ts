import assert from "node:assert/strict";
import test from "node:test";
import { createOrderAccessToken, verifyOrderAccessToken } from "../src/lib/order-access";
import { hashPassword, verifyPassword } from "../src/lib/password";

test("password hashes use unique salts and verify safely", () => {
  const first = hashPassword("a long admin password");
  const second = hashPassword("a long admin password");
  assert.notEqual(first, second);
  assert.equal(verifyPassword("a long admin password", first), true);
  assert.equal(verifyPassword("wrong password", first), false);
});

test("order access tokens only match their stored digest", () => {
  const first = createOrderAccessToken();
  const second = createOrderAccessToken();
  assert.equal(verifyOrderAccessToken(first.token, first.hash), true);
  assert.equal(verifyOrderAccessToken(second.token, first.hash), false);
});
