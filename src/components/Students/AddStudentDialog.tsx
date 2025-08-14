// ملف: src/components/Students/AddScheduleDialog.tsx

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

// تأكد من المسار الصحيح لنوع البيانات (Type) الخاص بالنموذج
import type { ScheduleFormValues } from '../../lib/types';

// هذا تعريف لمصفوفة المواد الدراسية.
const subjects = [
  { id: '1', name: 'لغة فرنسية' },
  { id: '2', name: 'لغة إنجليزية' },
  { id: '3', name: 'كيمياء' },
  // ... أضف المزيد من المواد هنا
];

// تعريف الـ props الخاصة بالمكون
interface AddScheduleDialogProps {
    onAddSchedule: (values: ScheduleFormValues) => Promise<void>;
}

const AddScheduleDialog = ({ onAddSchedule }: AddScheduleDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setOpen] = useState(false); // للتحكم في فتح وإغلاق الحوار
  const form = useForm<ScheduleFormValues>();

  const onSubmit = async (values: ScheduleFormValues) => {
    setIsLoading(true);
    try {
      await onAddSchedule(values);
      toast.success('تم إضافة الموعد بنجاح');
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding schedule:", error);
      toast.error('حدث خطأ أثناء إضافة الموعد. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* هذا هو الزر الذي يفتح الحوار */}
      <button onClick={() => setOpen(true)} disabled={isLoading}>
        {isLoading ? 'جاري الإضافة...' : 'أضف موعد جديد'}
      </button>

      {/* هذا هو مكون الحوار (Dialog) نفسه */}
      {/* سيتم عرضه فقط عندما تكون حالة isOpen صحيحة */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
          }}>
            <h2>أضف موعد جديد</h2>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* حقل اختيار المادة */}
              <select {...form.register('subject')}>
                <option value="">اختر مادة</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>

              {/* حقل آخر يمكن أن يكون لتاريخ أو وقت الموعد */}
              {/* <input type="date" {...form.register('date')} /> */}

              <div style={{ marginTop: '15px' }}>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'جاري الإرسال...' : 'إضافة الموعد'}
                </button>
                <button type="button" onClick={() => setOpen(false)} style={{ marginLeft: '10px' }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
};

export default AddScheduleDialog;