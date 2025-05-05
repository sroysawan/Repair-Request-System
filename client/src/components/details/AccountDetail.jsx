import React from "react";
import Profile from "../navbar/Profile";
import { useNavigate, useParams } from "react-router";
import useAuthStore from "../../store/auth-store";
import { FormImage } from "../form/FormUploadImage";
import { dateFormat } from "../../utils/dateFormat";
import { ColorChipsUser } from "../ui/ColorChips";
import { useEffect } from "react";
import { useState } from "react";
import useUserStore from "../../store/user-store";
import { ChangePasswordButton, EditUserButton } from "../form/Buttons";
import { changePasswordUser } from "../../api/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "../../utils/schema";
import { toast } from "react-toastify";

const AccountDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const token = useAuthStore((state) => state.token);
  const getUserById = useUserStore((state) => state.getUserById);
  const userDetail = useUserStore((state) => state.userDetail);
  const clearUserDetail = useUserStore((state) => state.clearUserDetail);
  const actionCurrentUsers = useAuthStore((state) => state.actionCurrentUser);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(passwordSchema),
  });
  const { errors, isSubmitting } = formState;
  console.log("Errors:", formState.errors);

  const [loading, setLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState({});
  const [openPassword, setOpenPassword] = useState(false);
  const [passwordId, setPasswordId] = useState(null);

  useEffect(() => {
    // getUsers(token)
    actionCurrentUsers(token);
  }, [token]);
  useEffect(() => {
    if (id) {
      clearUserDetail();
      setLoading(true);
      getUserById(token, id).finally(() => setLoading(false));
    }
    return () => {
      clearUserDetail();
    };
  }, [id, token]);
  console.log("userDetail0", userDetail);

  const handleOpenEdit = async (id) => {
    try {
      setPasswordId(id); // ✅ ตั้งค่า id หลังจากโหลดเสร็จ
      setOpenPassword(true); // ✅ เปิด Modal หลังจากโหลดข้อมูลสำเร็จ
      console.log("open change password ", id);
    } catch (error) {
      console.error("Error fetching position data:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log("Submitted Data:", passwordId, data);
      await new Promise((resolver) => setTimeout(resolver, 3000));
      const res = await changePasswordUser(token, passwordId, data);
      // console.log(res.data);
      toast.success(`เปลี่ยนรหัสผ่านสำเร็จ!`);
      await getUserById(token);
      handleCloseEdit();
      reset();
    } catch (error) {
      const errMsg = error.response?.data?.message;
      toast.error(errMsg);
    }
  };

  const handleCloseEdit = () => {
    setPasswordId(null);
    // clearUserDetail(); // ✅ ล้างค่าข้อมูล
    setOpenPassword(false);
    reset(); // ✅ เคลียร์ฟอร์ม
  };

  const handleEditClick = (id) => {
    if (currentUser.role === "ADMIN") {
      return navigate(`/admin/edit/${id}`);
    } else if (currentUser.role === "SUPERVISOR") {
      return navigate(`/supervisor/edit/${id}`);
    } else if (currentUser.role === "TECHNICIAN") {
      return navigate(`/technician/edit/${id}`);
    } else if (currentUser.role === "USER") {
      return navigate(`/user/edit/${id}`);
    }

    console.log("id edit", id);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: "none",
    p: 4,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="text-center text-red-500">
        <p>ไม่พบข้อมูลอุปกรณ์</p>
      </div>
    );
  }
  return (
    <section>
      <h1 className="text-2xl font-bold">
        ข้อมูลบัญชีผู้ใช้ {userDetail?.firstName || "-"}{" "}
        {userDetail?.lastName || "-"}
      </h1>
      <hr className="mb-3" />
      <div className="border p-6 rounded-md shadow-md">
        <div className="space-y-8">
          <div className="flex justify-center">
            <FormImage defaultValue={userDetail.picture?.url} />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-lg font-semibold text-gray-700">ชื่อ</p>
              <p className="text-gray-800">{userDetail?.firstName || "-"}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">นามสกุล</p>
              <p className="text-gray-800">{userDetail?.lastName || "-"}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">แผนก</p>
              <p className="text-gray-800">
                {userDetail?.department.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">ตำแหน่ง</p>
              <p className="text-gray-800">
                {userDetail?.position.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">Email</p>
              <p className="text-gray-800">{userDetail?.email || "-"}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">เบอร์</p>
              <p className="text-gray-800">{userDetail?.tel || "-"}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">Username</p>
              <p className="text-gray-800">{userDetail?.userName || "-"}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">สิทธิ์</p>
              <p className="text-gray-800">{userDetail?.role || "-"}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">สถานะ</p>
              <ColorChipsUser text={userDetail?.enabled} />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">วันที่สร้าง</p>
            <p className="text-gray-800">
              {dateFormat(userDetail?.createdAt) || "-"}
            </p>
          </div>

          {/* ส่วนแสดงรูปภาพ */}

          <div className="flex justify-end  items-center space-x-4">
            <ChangePasswordButton
              handleOpenEdit={() => handleOpenEdit(id)}
              handleCloseEdit={handleCloseEdit}
              openPassword={openPassword}
              style={style}
              register={register}
              errors={errors}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              title="รหัสผ่านใหม่"
            />
            <EditUserButton handleEditClick={() => handleEditClick(id)} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountDetail;
