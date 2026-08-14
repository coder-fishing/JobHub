import { useEffect, useMemo, useState } from 'react';
import { FileText, Paperclip, Eye, X } from 'lucide-react';
import { ProjectResponse } from '@/types/api';

interface JobDetailDescriptionProps {
  project: ProjectResponse;
}

export function JobDetailDescription({ project }: JobDetailDescriptionProps) {
  const [isAttachmentPreviewOpen, setIsAttachmentPreviewOpen] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const skillsList = project.requiredSkills
    ? project.requiredSkills.split(',').map((s) => s.trim())
    : [];
  const description = project.description?.trim();
  const attachmentUrl = project.attachmentUrl?.trim();
  const attachmentName = useMemo(() => {
    if (!attachmentUrl) return 'Tệp đính kèm';
    try {
      const url = new URL(attachmentUrl);
      const segments = url.pathname.split('/').filter(Boolean);
      return decodeURIComponent(segments[segments.length - 1] || 'Tệp đính kèm');
    } catch {
      return 'Tệp đính kèm';
    }
  }, [attachmentUrl]);

  const isImageAttachment = useMemo(() => {
    if (!attachmentUrl) return false;
    return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(attachmentUrl);
  }, [attachmentUrl]);

  const isPdfAttachment = useMemo(() => {
    if (!attachmentUrl) return false;
    return /\.pdf(\?|#|$)/i.test(attachmentUrl);
  }, [attachmentUrl]);

  const isOfficeAttachment = useMemo(() => {
    if (!attachmentUrl) return false;
    return /\.(docx?|xlsx?|pptx?)(\?|#|$)/i.test(attachmentUrl);
  }, [attachmentUrl]);

  useEffect(() => {
    if (!isAttachmentPreviewOpen || !attachmentUrl || !isPdfAttachment) {
      setPreviewBlobUrl(null);
      setPreviewError(null);
      setIsPreviewLoading(false);
      return;
    }

    const abortController = new AbortController();
    let objectUrl: string | null = null;

    const loadPdfPreview = async () => {
      try {
        setIsPreviewLoading(true);
        setPreviewError(null);

        const response = await fetch(attachmentUrl, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error('Không thể tải file PDF để xem trước.');
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPreviewBlobUrl(objectUrl);
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          setPreviewError(error?.message || 'Không thể xem trước file PDF.');
        }
      } finally {
        setIsPreviewLoading(false);
      }
    };

    loadPdfPreview();

    return () => {
      abortController.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [attachmentUrl, isAttachmentPreviewOpen, isPdfAttachment]);

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
        <FileText className="w-5 h-5 text-emerald-600" />
        <span>Mô Tả Chi Tiết Công Việc</span>
      </h3>

      <div className="text-sm text-slate-600 leading-relaxed space-y-4">
        {description ? (
          <p>{description}</p>
        ) : (
          <p className="text-slate-400 italic">Chưa có mô tả chi tiết cho dự án này.</p>
        )}
      </div>

      {project.attachmentUrl && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            <span>Tệp đính kèm</span>
          </h4>
          <button
            type="button"
            onClick={() => setIsAttachmentPreviewOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <Eye className="w-4 h-4" />
            Xem trước tệp đính kèm
          </button>
          <p className="text-[11px] text-slate-500">
            Nhấn vào để xem trước file đính kèm trong popup.
          </p>
        </div>
      )}

      {isAttachmentPreviewOpen && attachmentUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Xem trước tệp đính kèm"
          onClick={() => setIsAttachmentPreviewOpen(false)}
        >
          <div
            className="relative flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Preview file
                </p>
                <p className="text-sm font-semibold text-slate-900 break-all">{attachmentName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAttachmentPreviewOpen(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Đóng preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 min-h-0 bg-slate-50 p-3">
              {isImageAttachment ? (
                <img
                  src={attachmentUrl}
                  alt={attachmentName}
                  className="mx-auto max-h-[48vh] w-auto max-w-full rounded-2xl object-contain"
                />
              ) : isPdfAttachment ? (
                <iframe
                  src={previewBlobUrl ?? attachmentUrl}
                  title={attachmentName}
                  className="h-[48vh] w-full rounded-2xl border border-slate-200 bg-white"
                />
              ) : isOfficeAttachment ? (
                <div className="flex h-[48vh] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
                  <div className="max-w-md space-y-3">
                    <p className="text-sm font-semibold text-slate-900">
                      File Office không hỗ trợ preview trực tiếp.
                    </p>
                    <p className="text-sm text-slate-500">
                      Hãy bấm nút tải xuống bên dưới để lấy file về máy.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-[48vh] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
                  <div className="max-w-md space-y-3">
                    <p className="text-sm font-semibold text-slate-900">
                      Loại file này chưa hỗ trợ preview trực tiếp.
                    </p>
                    <p className="text-sm text-slate-500">
                      Hãy bấm nút tải xuống bên dưới để lấy file về máy.
                    </p>
                  </div>
                </div>
              )}

              {isPreviewLoading && isPdfAttachment && (
                <div className="absolute inset-4 flex items-center justify-center rounded-2xl bg-white/80 text-sm font-semibold text-slate-600">
                  Đang tải preview PDF...
                </div>
              )}

              {previewError && isPdfAttachment && (
                <div className="absolute inset-4 flex items-center justify-center rounded-2xl bg-white/90 px-6 text-center">
                  <div className="max-w-md space-y-3">
                    <p className="text-sm font-semibold text-slate-900">Không thể preview file PDF</p>
                    <p className="text-sm text-slate-500">{previewError}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4">
              <a
                href={attachmentUrl}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Tải xuống
              </a>
              <button
                type="button"
                onClick={() => setIsAttachmentPreviewOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
          Kỹ năng & Công nghệ yêu cầu
        </h4>
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill, idx) => (
            <span
              key={idx}
              className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-3 py-1.5 rounded-xl"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
