export const getStatusColor = (statusName) => {
    switch (statusName) {
      case "กำลังใช้งาน":
        return "success"; // สีเขียว ✅
      case "ไม่ได้ใช้งาน":
        return "default"; // สีเทา 🔘
      case "กำลังซ่อมแซม":
        return "warning"; // สีเหลือง ⚠️
      case "เสียหาย":
        return "error"; // สีแดง ❌
      case "รอดำเนินการ":
        return "info"; // สีฟ้า 🔵
      case "กำลังซ่อม":
        return "warning"; // สีเหลือง ⚠️
      case "ซ่อมเสร็จแล้ว":
        return "success"; // สีเขียว ✅
      case "ยกเลิกงาน":
        return "error"; // สีแดง ❌
      default:
        return "default";
    }
  };
  