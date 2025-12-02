import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useZustandUser from "../../zstore/useZustandUser";
import { userInfo } from "../../api/UserApi";
import type { Interest } from "../../types/SurveyData";
import type { UserInfoResponse } from "../../types/UserData";
import { getMyTop3Interests } from "../../api/SurveyApi.tsx";

const tagColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const ProfileCard = () => {
  const navigate = useNavigate();
  const { user } = useZustandUser();
  const [userInfoData, setUserInfoData] = useState<UserInfoResponse | null>(
    null
  );
  const [interests, setInterests] = useState<Interest[]>([]);
  const [interestMessage, setInterestMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.id === 0) return;

    const fetchUserInfo = async () => {
      try {
        const data = await userInfo();
        console.log("userInfoData", data);
        setUserInfoData(data);
      } catch (err) {
        console.error("사용자 상세 정보 로드 실패:", err);
      }
    };

    const fetchMyTopInterests = async () => {
      try {
        const res = await getMyTop3Interests();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setInterests(res.data);
          setInterestMessage(null);
        } else if (typeof res.data === "string") {
          setInterests([]);
          setInterestMessage(res.data);
        } else {
          setInterests([]);
          setInterestMessage("관심사가 없습니다.");
        }
      } catch (err) {
        console.error("관심사 조회 실패:", err);
        setInterestMessage("관심사를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchUserInfo();
    fetchMyTopInterests();
  }, [user]);

  const handleUpdateClick = () => {
    if (user && user.id) {
      navigate(`/check/password?next=/mypage/update/${user.id}`);
    }
  };

  const handleAdminPageClick = () => {
    navigate("/mypage/admin/statistics");
  };

  const getGenderDisplay = (gender?: "MALE" | "FEMALE" | "") => {
    if (gender === "MALE") return "남자";
    if (gender === "FEMALE") return "여자";
    return "-";
  };

  if (!user || user.id === 0) {
    return null;
  }

  const isAdmin = userInfoData?.role === "ADMIN";

  return (
    <div className="bg-white rounded-2xl shadow-lg px-6 py-7 mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">닉네임</div>
          <div className="font-bold">{user.username}</div>

          <div className="text-sm text-gray-500 mt-2 mb-1">나이</div>
          <div>{userInfoData?.age ?? "-"}</div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">내 관심사</h3>
            {interestMessage ? (
                <p className="text-gray-500">{interestMessage}</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                      <span
                          key={interest.interestId}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold text-white ${
                              tagColors[index % tagColors.length]
                          }`}
                      >
                {interest.content}
              </span>
                  ))}
                </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">이메일</div>
          <div className="font-bold">{userInfoData?.email || "-"}</div>

          <div className="text-sm text-gray-500 mt-2 mb-1">성별</div>
          <div>{getGenderDisplay(userInfoData?.gender)}</div>

          <div className="text-sm text-gray-500 mt-2 mb-1">직업</div>
          <div>{userInfoData?.workType || "-"}</div>

        </div>
      </div>



      {/* 버튼들을 같은 라인에 양쪽 정렬 */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleUpdateClick}
          className="cursor-pointer bg-[#9B8362] text-white px-4 py-2 rounded font-semibold hover:bg-[#7D6A4F] transition"
        >
          회원 정보 수정
        </button>

        {isAdmin && (
          <button
            onClick={handleAdminPageClick}
            className="bg-[#B89369] text-white px-4 py-2 rounded font-semibold hover:bg-[#A67F5C] transition"
          >
            관리자 페이지
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
