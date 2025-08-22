import { ref, watch, Ref, WatchSource, WatchCallback, isRef, isReactive } from 'vue';

/**
 * 防抖Hook
 * @param fn 需要防抖的函数
 * @param delay 防抖延迟时间(ms)
 * @returns 防抖处理后的函数和是否正在防抖的状态
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) {
  const isDebouncing = ref(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (...args: Parameters<T>): void => {
    if (timer) {
      clearTimeout(timer);
    }

    isDebouncing.value = true;

    timer = setTimeout(() => {
      fn(...args);
      isDebouncing.value = false;
      timer = null;
    }, delay);
  };

  const cancelDebounce = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      isDebouncing.value = false;
    }
  };

  return {
    debouncedFn,
    isDebouncing,
    cancelDebounce
  };
}

type ResolveSourceType<T> =
  T extends () => infer V ? V :
    T extends Ref<infer V> ? V :
      T;

/**
 * 基于值变化的防抖处理（适配Vue 3.5）
 * @param source 需要监听的源
 * @param fn 值变化时执行的函数
 * @param delay 防抖延迟时间(ms)
 * @returns 防抖相关对象
 */
export function useDebounceWatch<T>(
  source: T,
  fn: WatchCallback<ResolveSourceType<T>>,
  delay: number = 300
) {
  // 明确debouncedFn的类型为WatchCallback
  const { debouncedFn, isDebouncing, cancelDebounce } = useDebounce<WatchCallback<ResolveSourceType<T>>>(
    fn,
    delay
  );

  // 根据源类型创建正确的WatchSource
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

  // 完整传递watch回调的三个参数：新值、旧值、清理函数
  watch(watchSource, (newVal, oldVal, onCleanup) => {
    debouncedFn(newVal, oldVal, onCleanup);
  });

  return { isDebouncing, cancelDebounce };
}
