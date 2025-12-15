const signupUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
  } = req.body;

  try {
    // validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !membership_status
    ) {
      throw new Error("All fields must be filled");
    }

    // validate email using validator // updated
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // validate password strength using validator // updated
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: "Password is too weak" });
    }

    // validate phone number (10+ digits)
    if (!/^\d{10,}$/.test(phone_number)) {
      throw new Error("Phone number must contain at least 10 digits");
    }

    // validate enums
    if (!["Male", "Female", "Other"].includes(gender)) {
      throw new Error("Invalid gender value");
    }

    if (!["Active", "Inactive", "Suspended"].includes(membership_status)) {
      throw new Error("Invalid membership status");
    }

    // create user
    const user = await User.signup(
      name,
      email,
      password,
      phone_number,
      gender,
      date_of_birth,
      membership_status
    );

    // create a token
    const token = generateToken(user._id);

    res.status(201).json({
      user, // full user object including all fields
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
