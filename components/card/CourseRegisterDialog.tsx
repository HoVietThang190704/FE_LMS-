import React from 'react';


interface CourseRegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  courseName: string;
  classCode: string;
  teacher: string;
  credits?: number;
  schedule?: string;
  room?: string;
  currentSlot: number;
  maxSlot: number;
  isFull: boolean;
}


const CourseRegisterDialog: React.FC<CourseRegisterDialogProps> = ({
  open,
  onClose,
  onConfirm,
  loading,
  courseName,
  classCode,
  teacher,
  credits,
  schedule,
  room,
  currentSlot,
  maxSlot,
  isFull,
}) => {
  if (!open) return null;
  const slotLeft = maxSlot - currentSlot;
  return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center
                bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-6 min-w-[340px] max-w-[90vw]" style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Watermark background chỉ trong hộp trắng */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 0,
                  opacity: 0.15,
                  pointerEvents: 'none',
                  background: 'url("/images/watermark.png") center center / contain no-repeat',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 className="text-xl font-bold mb-1">Xác nhận đăng ký môn học</h2>
                <p className="text-gray-600 mb-4">Bạn có chắc chắn muốn đăng ký môn học này không?</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{courseName}</div>
                      <div className="text-sm text-gray-500">{classCode}</div>
                    </div>
                    {credits && (
                      <div className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">{credits} tín chỉ</div>
                    )}
                  </div>
                  <div className="mb-1 text-sm text-gray-700">Giảng viên: <span className="font-medium">{teacher}</span></div>
                  {schedule && (
                    <div className="mb-1 text-sm text-gray-700">Thời gian: <span className="font-medium">{schedule}</span></div>
                  )}
                  {room && (
                    <div className="mb-1 text-sm text-gray-700">Phòng: <span className="font-medium">{room}</span></div>
                  )}
                  <div className="mb-1 text-sm text-gray-700">Số chỗ còn lại: <span className="font-semibold">{slotLeft}/{maxSlot}</span></div>
                </div>
                {isFull && (
                  <div className="text-red-600 mb-2 text-sm font-medium">Lớp học này đã đầy</div>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="px-4 py-2 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Huỷ
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-white ${isFull ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} flex items-center justify-center`}
                    onClick={onConfirm}
                    disabled={isFull || loading}
                  >
                    {loading ? (
                      <span className="loader mr-2"></span>
                    ) : null}
                    Xác nhận đăng ký
                  </button>
                </div>
              </div>
              <style jsx>{`
                .loader {
                  border: 2px solid #f3f3f3;
                  border-top: 2px solid #3498db;
                  border-radius: 50%;
                  width: 16px;
                  height: 16px;
                  animation: spin 1s linear infinite;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
  );
};

export default CourseRegisterDialog;
