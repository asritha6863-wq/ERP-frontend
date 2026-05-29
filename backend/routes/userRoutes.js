router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.json({ message: "Wrong password" });
  }

  // ✅ SEND ROLE TO FRONTEND
  res.json({
    message: "Login success",
    role: user.role
  });
});