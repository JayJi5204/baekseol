// components/admin/PointLogsTable.tsx
import { useState, useEffect } from "react";
import { getPointLogs } from "../../api/SurveyApi";
import type { PointLogDto } from "../../types/SurveyData";

const PointLogsTable = () => {
    const [logs, setLogs] = useState<PointLogDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 검색 필터
    const [userId, setUserId] = useState<number | undefined>();
    const [nickname, setNickname] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        fetchLogs();
    }, [page, userId, nickname, type]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await getPointLogs(userId, nickname, type, page, 20);
            setLogs(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("포인트 로그 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(0);
        fetchLogs();
    };

    // pointType 한글 변환
    const translatePointType = (pt: string) => {
        switch (pt) {
            case "GET":
                return "충전";
            case "USE":
                return "사용";
            default:
                return pt;
        }
    };

    // referenceType 한글 변환
    const translateReferenceType = (rt: string) => {
        switch (rt) {
            case "PAYMENT":
                return "결제";
            case "WITHDRAWAL":
                return "환급";
            case "SURVEY_PARTICIPATE":
                return "설문참여";
            case "SURVEY_CREATE":
                return "설문등록";
            default:
                return rt;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">포인트 입출금 내역</h2>

            {/* 검색 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="number"
                    placeholder="유저 ID"
                    value={userId || ""}
                    onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : undefined)}
                    className="px-4 py-2 border rounded-lg"
                />
                <input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                >
                    <option value="">전체 구분</option>
                    <option value="PAYMENT">결제</option>
                    <option value="WITHDRAWAL">환급</option>
                    <option value="SURVEY_PARTICIPATE">설문참여</option>
                    <option value="SURVEY_CREATE">설문등록</option>
                </select>
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-[#B89369] text-white rounded-lg hover:bg-[#A07D56]"
                >
                    검색
                </button>
            </div>

            {/* 테이블 */}
            {loading ? (
                <div className="text-center py-8">로딩 중...</div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">닉네임</th>
                                <th className="px-4 py-2 text-left">구분</th>
                                <th className="px-4 py-2 text-right">금액</th>
                                <th className="px-4 py-2 text-right">잔여포인트</th>
                                <th className="px-4 py-2 text-left">타입</th>
                                <th className="px-4 py-2 text-left">일시</th>
                            </tr>
                            </thead>
                            <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{log.userId}</td>
                                    <td className="px-4 py-2">{log.nickname}</td>
                                    <td className="px-4 py-2">{translateReferenceType(log.referenceType)}</td>
                                    <td className={`px-4 py-2 text-right font-semibold ${log.pointType === 'GET' ? 'text-green-600' : 'text-red-600'}`}>
                                        {log.pointType === 'GET' ? '+' : '-'}{log.amount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-right">{log.remainPoint.toLocaleString()}</td>
                                    <td className="px-4 py-2">{translatePointType(log.pointType)}</td>
                                    <td className="px-4 py-2">{new Date(log.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이징 */}
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            이전
                        </button>
                        <span className="px-4 py-2">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page >= totalPages - 1}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            다음
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PointLogsTable
