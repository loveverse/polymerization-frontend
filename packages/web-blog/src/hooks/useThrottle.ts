import { ref, watch, Ref, WatchSource, WatchCallback, isRef, isReactive } from 'vue';

/**
 * 节流Hook
 * @param fn 需要节流的函数
 * @param delay 节流延迟时间(ms)
 * @returns 节流处理后的函数和是否正在节流的状态
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) {
  const isThrottling = ref(false);
  let lastExecTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const throttledFn = (...args: Parameters<T>): void => {
    const now = Date.now();

    // 如果处于节流状态且距离上次执行时间小于延迟时间，则不执行
    if (isThrottling.value && now - lastExecTime < delay) {
      return;
    }

    // 如果有定时器则清除
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 执行函数
    fn(...args);
    lastExecTime = now;
    isThrottling.value = true;

    // 延迟后解除节流状态
    timer = setTimeout(() => {
      isThrottling.value = false;
      timer = null;
    }, delay);
  };

  // 取消节流的方法
  const cancelThrottle = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      isThrottling.value = false;
    }
  };

  return {
    throttledFn,
    isThrottling,
    cancelThrottle
  };
}

// 解析源类型
type ResolveSourceType<T> =
  T extends () => infer V ? V :
    T extends Ref<infer V> ? V :
      T;

/**
 * 基于值变化的节流处理
 * @param source 需要监听的源
 * @param fn 值变化时执行的函数
 * @param delay 节流延迟时间(ms)
 * @returns 节流相关对象
 */
export function useThrottleWatch<T>(
  source: T,
  fn: WatchCallback<ResolveSourceType<T>>,
  delay: number = 300
) {
  // 创建合适的watch源
  let watchSource: WatchSource<ResolveSourceType<T>>;

  if (typeof source === 'function') {
    watchSource = source as WatchSource<ResolveSourceType<T>>;
  } else if (isRef(source)) {
    watchSource = () => source.value as ResolveSourceType<T>;
  } else if (isReactive(source)) {
    watchSource = () => source as ResolveSourceType<T>;
  } else {
    watchSource = () => source as ResolveSourceType<T>;
  }

  // 明确指定泛型类型，确保类型匹配
  const { throttledFn, isThrottling, cancelThrottle } = useThrottle<WatchCallback<ResolveSourceType<T>>>(
    fn,
    delay
  );

  // 完整传递watch回调的所有参数
  watch(watchSource, (newVal, oldVal, onCleanup) => {
    throttledFn(newVal, oldVal, onCleanup);
  });

  return { isThrottling, cancelThrottle };
}
