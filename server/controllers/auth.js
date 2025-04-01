const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      departmentId,
      positionId,
      tel,
      email,
      userName,
      password,
      role,
      pictureId,
    } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { userName: userName }],
      },
    });

    if (user) {
      let message = "";

      if (user.email === email && user.userName === userName) {
        message = "Email and Username already exist.";
      } else if (user.email === email) {
        message = "Email already exists.";
      } else if (user.userName === userName) {
        message = "Username already exists.";
      }

      return res.status(400).json({
        message: message,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // ตรวจสอบว่ามี picture หรือไม่
    let imageId = null;
    if (pictureId) {
      const image = await prisma.image.create({
        data: {
          asset_id: pictureId.asset_id,
          public_id: pictureId.public_id,
          url: pictureId.url,
          secure_url: pictureId.secure_url,
        },
      });
      imageId = image.id; // เก็บ imageId หากมีรูปภาพ
    }

    const authUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        departmentId: departmentId,
        positionId: positionId,
        tel: tel,
        email: email,
        userName: userName,
        password: hashPassword,
        role: role,
        pictureId: imageId,
      },
    });

    res.json({
      authUser,
      message: "Created user successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        userName: userName,
      },
      select: {
        id: true,
        firstName: true,
        userName: true,
        role: true,
        password: true,
        enabled: true,
        department: true, // ดึงเฉพาะ departmentId
        picture: {
          select: {
            url: true,
          },
        },
      },
    });
    console.log(user);

    if (!user || !user.enabled) {
      return res.status(400).json({
        message: "User Not Found or not Enabled",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password Invalid",
      });
    }

    const payload = {
      id: user.id,
      name: user.firstName,
      username: user.userName,
      role: user.role,
      department: user.department,
      picture: user.picture?.url || null,
    };
    // console.log("payload: " , payload);
    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: "7d" },
      (error, token) => {
        if (error) {
          return res.status(500).json({
            message: "Server Error",
          });
        }
        res.json({
          payload,
          token,
          message: "Login Successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.currentUser = async (req, res) => {
  try {
    const { username } = req.user;
    console.log(username);
    const user = await prisma.user.findUnique({
      where: {
        userName: username,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
        department: {
          select: { name: true }, // ดึงเฉพาะชื่อ department
        },
        picture: {
          select: {
            url: true, // ดึง URL ของรูปภาพ
          },
        },
      },
    });
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
