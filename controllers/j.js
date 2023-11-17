// Update user profile
const updateUserProfile = async (req, res) => {
  const { name, address, bankAccount } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.address = address || user.address;
    user.bankAccount = bankAccount || user.bankAccount;

    await user.save();

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
