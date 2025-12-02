export enum WorkType {
    IT = 'IT',
    OFFICE = 'OFFICE',
    MANUFACTURING = 'MANUFACTURING',
    SERVICE = 'SERVICE',
    EDUCATION = 'EDUCATION',
    MEDICAL = 'MEDICAL',
    CREATIVE = 'CREATIVE',
    STUDENT = 'STUDENT',
    SELF_EMPLOYED = 'SELF_EMPLOYED',
    ETC = 'ETC',
}

export enum AgeGroup {
    TEEN = 'TEEN',
    TWENTIES = 'TWENTIES',
    THIRTIES = 'THIRTIES',
    FORTIES = 'FORTIES',
    FIFTIES = 'FIFTIES',
    SIXTY_PLUS = 'SIXTY_PLUS',
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

// WorkType 한글 표시명
export const WorkTypeLabels: Record<WorkType, string> = {
    [WorkType.IT]: 'IT/개발',
    [WorkType.OFFICE]: '사무/관리직',
    [WorkType.MANUFACTURING]: '제조/건설',
    [WorkType.SERVICE]: '서비스/판매',
    [WorkType.EDUCATION]: '교육',
    [WorkType.MEDICAL]: '의료',
    [WorkType.CREATIVE]: '창작/디자인/미디어',
    [WorkType.STUDENT]: '학생',
    [WorkType.SELF_EMPLOYED]: '프리랜서/자영업',
    [WorkType.ETC]: '기타',
};

// AgeGroup 한글 표시명
export const AgeGroupLabels: Record<AgeGroup, string> = {
    [AgeGroup.TEEN]: '10대',
    [AgeGroup.TWENTIES]: '20대',
    [AgeGroup.THIRTIES]: '30대',
    [AgeGroup.FORTIES]: '40대',
    [AgeGroup.FIFTIES]: '50대',
    [AgeGroup.SIXTY_PLUS]: '60대 이상',
};

// Gender 한글 표시명
export const GenderLabels: Record<Gender, string> = {
    [Gender.MALE]: '남성',
    [Gender.FEMALE]: '여성',
};

export const WorkTypeOptions = Object.entries(WorkTypeLabels).map(([value, label]) => ({
    value: value as WorkType,
    label,
}));

export const AgeGroupOptions = Object.entries(AgeGroupLabels).map(([value, label]) => ({
    value: value as AgeGroup,
    label,
}));

export const GenderOptions = Object.entries(GenderLabels).map(([value, label]) => ({
    value: value as Gender,
    label,
}));