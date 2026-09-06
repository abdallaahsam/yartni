import { z } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map(e => e.message).join('، ');
        return res.status(400).json({ error: errorMessages });
      }
      return res.status(400).json({ error: 'البيانات المدخلة غير صحيحة' });
    }
  };
}

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
    .max(25, 'اسم المستخدم طويل جداً')
    .regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام وعلامة _ فقط'),
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم طويل جداً'),
  email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف'),
  current_age: z.coerce.number()
    .int('العمر يجب أن يكون رقماً صحيحاً')
    .min(12, 'العمر يجب أن يكون 12 سنة فما فوق')
    .max(100, 'العمر يجب أن يكون 100 سنة كحد أقصى')
});

export const loginSchema = z.object({
  email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(1, 'يرجى إدخال كلمة المرور')
});

export const adviceSchema = z.object({
  headline: z.string().min(5, 'عنوان النصيحة يجب أن يكون 5 أحرف على الأقل').max(200, 'العنوان طويل جداً'),
  story: z.string().min(10, 'تفاصيل القصة والتجربة يجب أن تكون 10 أحرف على الأقل'),
  lesson: z.string().min(5, 'الدرس المستفاد ("لو رجع بيا الزمن") يجب أن يكون 5 أحرف على الأقل'),
  target_age: z.coerce.number().int().min(10).max(100),
  category_id: z.coerce.number().int(),
  is_anonymous: z.union([z.boolean(), z.number()]).transform(val => (val ? 1 : 0)).optional()
});

export const commentSchema = z.object({
  content: z.string().min(1, 'لا يمكن إضافة تعليق فارغ').max(1500, 'التعليق طويل جداً')
});

export const reportSchema = z.object({
  reason: z.string().min(3, 'يرجى كتابة سبب الإبلاغ بوضوح').max(500, 'سبب الإبلاغ طويل جداً')
});
