/**
 * 副号类型定义
 *
 * 每种副号类型对应不同的号码格式化规则，
 * 后续新增类型只需在此处添加配置即可。
 */

/** 副号类型枚举值 */
export const SUB_NUMBER_TYPES = {
  /** 移动和多号类型 */
  CMCC_MULTI: "cmcc_multi",
} as const;

/** 副号类型显示名称映射 */
export const SUB_NUMBER_TYPE_NAMES: Record<string, string> = {
  [SUB_NUMBER_TYPES.CMCC_MULTI]: "移动和多号",
};

/** 所有支持的副号类型列表 */
export const ALL_SUB_NUMBER_TYPES = [SUB_NUMBER_TYPES.CMCC_MULTI];

/**
 * 副号类型配置接口
 */
export interface SubNumberTypeConfig {
  /** 类型标识 */
  type: string;
  /** 类型显示名称 */
  name: string;
  /** 号码格式化函数 */
  formatPhone: (originalPhone: string, subIndex: number) => string;
  /** 格式说明 */
  formatDescription: (subIndex: number) => string;
}

/**
 * 移动和多号格式化函数
 *
 * 规则：12583 + 副号序号 + 原号码
 * 例如：使用副号1发给 13800138000，结果为 12583113800138000
 *
 * @param originalPhone - 原始目标号码
 * @param subIndex - 副号序号（1-based）
 * @returns 格式化后的号码
 */
function formatCmccMultiPhone(
  originalPhone: string,
  subIndex: number,
): string {
  if (!originalPhone || subIndex < 1) {
    return originalPhone;
  }
  return `12583${subIndex}${originalPhone}`;
}

/**
 * 移动和多号格式说明
 */
function getCmccMultiFormatDescription(subIndex: number): string {
  return `目标号码将自动添加前缀 12583${subIndex}`;
}

/**
 * 副号类型配置映射表
 *
 * 每种类型包含：类型标识、显示名称、格式化函数、格式说明
 */
export const SUB_NUMBER_TYPE_CONFIGS: Record<string, SubNumberTypeConfig> = {
  [SUB_NUMBER_TYPES.CMCC_MULTI]: {
    type: SUB_NUMBER_TYPES.CMCC_MULTI,
    name: SUB_NUMBER_TYPE_NAMES[SUB_NUMBER_TYPES.CMCC_MULTI],
    formatPhone: formatCmccMultiPhone,
    formatDescription: getCmccMultiFormatDescription,
  },
};

/**
 * 根据副号类型格式化目标号码
 *
 * @param subType - 副号类型标识
 * @param originalPhone - 原始目标号码
 * @param subIndex - 副号序号（1-based）
 * @returns 格式化后的号码，若类型不支持则返回原号码
 */
export function formatSubNumberPhone(
  subType: string,
  originalPhone: string,
  subIndex: number,
): string {
  const config = SUB_NUMBER_TYPE_CONFIGS[subType];
  if (!config) {
    return originalPhone;
  }
  return config.formatPhone(originalPhone, subIndex);
}

/**
 * 获取副号类型的格式说明
 *
 * @param subType - 副号类型标识
 * @param subIndex - 副号序号（1-based）
 * @returns 格式说明文本，若类型不支持则返回空字符串
 */
export function getSubNumberFormatDescription(
  subType: string,
  subIndex: number,
): string {
  const config = SUB_NUMBER_TYPE_CONFIGS[subType];
  if (!config) {
    return "";
  }
  return config.formatDescription(subIndex);
}

/**
 * 获取副号类型的显示名称
 *
 * @param subType - 副号类型标识
 * @returns 显示名称，若类型不存在则返回类型标识本身
 */
export function getSubNumberTypeName(subType: string): string {
  return SUB_NUMBER_TYPE_NAMES[subType] || subType;
}

/**
 * 检查副号类型是否有效
 *
 * @param subType - 副号类型标识
 * @returns 是否为支持的类型
 */
export function isValidSubNumberType(subType: string): boolean {
  return ALL_SUB_NUMBER_TYPES.includes(subType);
}