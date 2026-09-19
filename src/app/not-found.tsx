import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-bold text-stone-300">404</p>
      <h1 className="mt-4 text-xl font-bold">页面不存在或已下线</h1>
      <p className="mt-2 max-w-md text-stone-600">
        攻略可能已更新换代。旧版本攻略会标注适用版本与验证时间，过期内容会及时下线。
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-stone-900 px-5 py-2 text-sm text-white hover:bg-stone-700"
        >
          回首页
        </Link>
        <Link
          href="/search"
          className="rounded-full bg-stone-100 px-5 py-2 text-sm hover:bg-stone-200"
        >
          搜索攻略
        </Link>
      </div>
    </div>
  );
}
