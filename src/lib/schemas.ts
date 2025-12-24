import { z } from 'zod';

// ==========================================
// Enums y Constantes
// ==========================================

export const UserLevelEnum = z.enum(['Pawn', 'Bishop', 'Rook', 'King']);
export const SkillCategoryEnum = z.enum(['Tactics', 'Strategy', 'Endgame', 'Openings']);
export const LeadStatusEnum = z.enum(['new', 'contacted', 'trial', 'converted', 'lost']);
export const PaymentMethodEnum = z.enum(['cash', 'transfer', 'bizum', 'other']);
export const AttendanceStatusEnum = z.enum(['present', 'absent', 'excused']);
export const PlanTypeEnum = z.enum(['free', 'profe', 'club']);

// ==========================================
// Esquemas de Entidades Principales
// ==========================================

// --- Student Schema ---
export const StudentSchema = z.object({
    id: z.string().uuid().optional(), // El ID es opcional al crear, obligatorio al leer
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido").optional().or(z.literal('')),
    phone: z.string().min(9, "Teléfono inválido").optional().or(z.literal('')),
    level: UserLevelEnum.default('Pawn'),
    centerId: z.string().uuid().optional(),
    notes: z.string().max(1000, "Las notas son demasiado largas").optional(),
    skills: z.array(z.string()).optional(),
    joinedAt: z.string().datetime().optional()
});

// --- Center Schema ---
export const CenterSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, "El nombre del centro es muy corto"),
    location: z.string().min(5, "La ubicación debe ser descriptiva"),
    description: z.string().optional()
});

// --- ClassGroup Schema ---
export const ClassGroupSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, "Nombre de clase inválido"),
    centerId: z.string().uuid("Debes seleccionar un centro"),
    schedule: z.string().min(1, "Debes definir un horario"),
    level: UserLevelEnum,
    students: z.array(z.string().uuid()).optional(),
    duration: z.number().min(15).max(300).default(60)
});

// --- Skill Schema ---
export const SkillSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, "Nombre de habilidad inválido"),
    category: SkillCategoryEnum,
    level: z.number().min(1).max(10),
    description: z.string().min(5, "Añade una descripción breve"),
    content: z.string().optional()
});

// --- Attendance Schema ---
export const AttendanceRecordSchema = z.object({
    id: z.string().uuid().optional(),
    classId: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
    records: z.array(z.object({
        studentId: z.string().uuid(),
        status: AttendanceStatusEnum
    })),
    sessionNotes: z.string().optional(),
    skills: z.array(z.string()).optional()
});

// --- Payment Schema ---
export const PaymentSchema = z.object({
    id: z.string().uuid().optional(),
    studentId: z.string().uuid("Debes seleccionar un alumno"),
    amount: z.number().positive("La cantidad debe ser positiva"),
    concept: z.string().min(3, "Concepto requerido"),
    date: z.string().datetime(),
    method: PaymentMethodEnum,
    notes: z.string().optional()
});

// --- Lesson Plan Schema ---
export const LessonSegmentSchema = z.object({
    id: z.string().uuid().optional(),
    type: z.enum(['opening', 'tactics', 'strategy', 'endgame', 'game', 'analysis', 'other']),
    title: z.string().min(1, "Título requerido"),
    duration: z.number().positive(),
    notes: z.string().optional()
});

export const LessonPlanSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(3, "Título del plan requerido"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    classId: z.string().uuid().optional(),
    segments: z.array(LessonSegmentSchema),
    totalDuration: z.number().nonnegative().optional(), // Calculated
    createdAt: z.string().datetime().optional()
});

// --- Lead Schema ---
export const LeadSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(2, "Nombre requerido"),
    contact: z.string().min(1, "Contacto requerido (email o teléfono)"),
    status: LeadStatusEnum.default('new'),
    source: z.enum(['web', 'referral', 'flyer', 'other']).optional(),
    notes: z.string().optional(),
    createdAt: z.string().datetime().optional()
});

// --- Tournament Schema ---
export const TournamentMatchSchema = z.object({
    id: z.string().uuid(),
    round: z.number().int().positive(),
    whiteId: z.string().uuid(),
    blackId: z.string().uuid(),
    result: z.enum(['1-0', '0-1', '0.5-0.5']).nullable()
});

export const TournamentSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, "Nombre del torneo requerido"),
    date: z.string().datetime(),
    status: z.enum(['Upcoming', 'Ongoing', 'Completed']).default('Upcoming'),
    participants: z.array(z.string().uuid()),
    matches: z.array(TournamentMatchSchema).optional(),
    format: z.string().default('Suizo')
});

// ==========================================
// Tipos inferidos (para usar en TypeScript)
// ==========================================

export type StudentInput = z.infer<typeof StudentSchema>;
export type CenterInput = z.infer<typeof CenterSchema>;
export type ClassGroupInput = z.infer<typeof ClassGroupSchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
export type SkillInput = z.infer<typeof SkillSchema>;
export type LessonPlanInput = z.infer<typeof LessonPlanSchema>;
export type LeadInput = z.infer<typeof LeadSchema>;
export type TournamentInput = z.infer<typeof TournamentSchema>;
