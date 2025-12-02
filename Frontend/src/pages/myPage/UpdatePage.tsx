import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import UpdateComponent from "../../components/user/UpdateComponent";
import type {
  UserUpdateRequest,
  UserUpdateResponse,
} from "../../types/UserData";
import * as userApi from "../../api/UserApi";
import useZustandUser from "../../zstore/useZustandUser";
import { AxiosError } from "axios";
import type { FieldError } from "react-hook-form";

function UpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateUserInfo } = useZustandUser();

  const [userData, setUserData] = useState<UserUpdateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!id) throw new Error("No user id");

        // ✅ 이제 토큰 꺼내지 않아도 됨 (jwtAxios가 자동 처리)
        const res = await userApi.userInfo();
        setUserData(res);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  async function handleUpdate(
    data: UserUpdateRequest,
    setError: (name: keyof UserUpdateRequest, error: FieldError) => void
  ) {
    try {
      // ✅ 비밀번호가 비어있으면 제거
      const filteredData = { ...data };
      if (!filteredData.password) delete filteredData.password;

      // ✅ 토큰 전달 X
      await userApi.updateUser(filteredData);

      // ✅ 수정 후 유저 정보 갱신
      const updatedUser = await userApi.userInfo();
      updateUserInfo({
        username: updatedUser.username,
        id: updatedUser.id,
      });

      alert("회원 정보가 성공적으로 수정되었습니다!");
      navigate(`/mypage`);
    } catch (e) {
      if (e instanceof AxiosError && e.response?.data) {
        const { field, message } = e.response.data as {
          field?: keyof UserUpdateRequest;
          message?: string;
        };
        if (field && message) {
          setError(field, { type: "manual", message });
          return;
        }
      }
      alert("수정 중 오류가 발생했습니다.");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!userData) return <div>No user data found.</div>;

  return (
    <div>
      <UpdateComponent
        initialData={userData}
        onSubmit={(data, setError) => handleUpdate(data, setError)}
      />
    </div>
  );
}

export default UpdatePage;
