import type { MultiSimConfig, SimInfo } from "@/types";

/**
 * 格式化副号发送的目标号码
 *
 * 规则：12583 + 副号序号 + 原号码
 * 例如：使用副号1发给 13800138000，结果为 12583113800138000
 *
 * @param originalPhone - 原始目标号码
 * @param subIndex - 副号序号（1-based）
 * @returns 格式化后的号码
 */
export function formatSubNumberPhone(
  originalPhone: string,
  subIndex: number,
): string {
  if (!originalPhone || subIndex < 1) {
    return originalPhone;
  }
  return `12583${subIndex}${originalPhone}`;
}

/**
 * 解析副号列表 JSON 字符串为数组
 *
 * @param subNumbersStr - JSON 格式的副号列表字符串
 * @returns 副号号码数组
 */
export function parseSubNumbers(subNumbersStr: string): string[] {
  try {
    const parsed = JSON.parse(subNumbersStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 根据设备 SIM 卡号码查找匹配的单卡多副卡配置
 *
 * 匹配规则：SIM 卡号码与配置中的主号完全匹配
 *
 * @param simNumber - 设备识别的 SIM 卡号码
 * @param configs - 所有单卡多副卡配置列表
 * @returns 匹配的配置，若无匹配返回 null
 */
export function findMatchingMultiSimConfig(
  simNumber: string | undefined | null,
  configs: MultiSimConfig[],
): MultiSimConfig | null {
    console.log('simNumber',simNumber,'configs',configs);
    
  if (!simNumber || !configs || configs.length === 0) {
    return null;
  }

  return configs.find((config) =>simNumber.includes(config.main_number)) || null;
}

/**
 * 从 SIM 信息列表中提取号码
 *
 * 优先使用 extra_sim 字段，其次使用 sim_info 中的 number
 *
 * @param simInfoList - SIM 信息列表
 * @param simSlot - SIM 卡槽索引（1 或 2）
 * @param extraSim1 - SIM1 的额外号码配置
 * @param extraSim2 - SIM2 的额外号码配置
 * @returns SIM 卡号码，未找到返回 null
 */
export function getSimNumber(
  simInfoList: Record<string, SimInfo>,
  simSlot: number,
  extraSim1?: string,
  extraSim2?: string,
): string | null {
    console.log('getSimNumber',simInfoList,simSlot,extraSim1,extraSim2);
  // 优先使用 extra_sim 配置
  if (simSlot === 1 && extraSim1) {
    return extraSim1;
  }
  if (simSlot === 2 && extraSim2) {
    return extraSim2;
  }

  // 其次从 sim_info_list 中获取
  const simIndex = simSlot - 1; // 转换为 0-based 索引
  const simInfo = simInfoList[simIndex.toString()];
  return simInfo?.number || null;
}

/**
 * 检查指定 SIM 卡槽是否支持副号发送
 *
 * 条件：SIM 卡号码与某个配置的主号匹配
 *
 * @param simInfoList - SIM 信息列表
 * @param simSlot - SIM 卡槽索引（1 或 2）
 * @param configs - 所有单卡多副卡配置列表
 * @param extraSim1 - SIM1 的额外号码配置
 * @param extraSim2 - SIM2 的额外号码配置
 * @returns 匹配的配置，不支持返回 null
 */
export function checkSubNumberSupport(
  simInfoList: Record<string, SimInfo>,
  simSlot: number,
  configs: MultiSimConfig[],
  extraSim1?: string,
  extraSim2?: string,
): MultiSimConfig | null {
  const simNumber = getSimNumber(simInfoList, simSlot, extraSim1, extraSim2);
  return findMatchingMultiSimConfig(simNumber, configs);
}
