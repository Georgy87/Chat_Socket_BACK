import { check } from "express-validator";

export default [
    check("email", "Uncorrect email").isEmail(),
    check(
        "password",
        "Password must be longer than 3 and shorter than 12"
    ).isLength({ min: 3, max: 20 }),
];
