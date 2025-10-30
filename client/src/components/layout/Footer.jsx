export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/60 bg-white/50">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-[#666]">
        © {new Date().getFullYear()} EduNexus. All rights reserved.
      </div>
    </footer>
  )
}
