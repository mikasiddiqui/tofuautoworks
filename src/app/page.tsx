import Image from "next/image";
import { ArrowUpRight, Construction, Mail, Youtube } from "lucide-react";
import BuildLog from "@/components/BuildLog";
import MusicPlayer from "@/components/MusicPlayer";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  return (
    <main className="site-shell" id="home">
      <a className="skip-link" href="#blog">Skip to the build log</a>
      <header className="site-header">
        <a href="#home" className="brand-link" aria-label="Tofu Auto Works home">
          <Image src={`${basePath}/logo.webp`} alt="Tofu Auto Works" width={768} height={250} priority className="brand-logo" />
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#blog">Blog</a>
          <a href="#products">Products</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <div className="welcome-strip">
        <span lang="ja">いらっしゃいませ</span>
        <span>Welcome to the garage. Stay a while.</span>
      </div>
      <div className="site-grid">
        <aside className="music-column" aria-label="Workshop radio">
          <MusicPlayer />
          <p className="sidebar-footnote">A little background music<br />for your time in the garage.</p>
        </aside>
        <section className="blog-column" id="blog" aria-label="Tofu Auto Works build log" tabIndex={-1}>
          <BuildLog />
        </section>
        <aside className="info-column" aria-label="Shop, contact and links">
          <section className="retro-panel web-links">
            <h2 className="panel-heading">Around the web <ArrowUpRight size={14} aria-hidden="true" /></h2>
            <div className="panel-content">
              <a className="outbound-link" href="https://www.youtube.com/@TofuAutoWorks" target="_blank" rel="noopener noreferrer">
                <span><Youtube size={16} aria-hidden="true" /> YouTube</span><ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a className="outbound-link" href="https://www.instagram.com/tofuautoworks/" target="_blank" rel="noopener noreferrer">
                <span>Instagram</span><ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a className="outbound-link" href="https://www.patreon.com/TofuAutoWorks" target="_blank" rel="noopener noreferrer">
                <span>Patreon</span><ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <p className="link-note">Follow the builds, start to finish.</p>
            </div>
          </section>
          <section className="retro-panel coming-soon" id="products" tabIndex={-1}>
            <h2 className="panel-heading">Products <span lang="ja">製品</span></h2>
            <div className="panel-content">
              <Construction size={28} strokeWidth={1.5} className="coming-soon-icon" aria-hidden="true" />
              <p className="coming-soon-title">Coming soon</p>
              <p>The shop is still in the works. Check back here for updates.</p>
              <span className="construction-stamp">Under construction</span>
            </div>
          </section>
          <section className="retro-panel coming-soon" id="contact" tabIndex={-1}>
            <h2 className="panel-heading">Contact <span lang="ja">連絡先</span></h2>
            <div className="panel-content">
              <Mail size={28} strokeWidth={1.5} className="coming-soon-icon" aria-hidden="true" />
              <p className="coming-soon-title">Coming soon</p>
              <p>Contact details will be available here soon.</p>
              <a className="text-link" href="https://www.youtube.com/@TofuAutoWorks" target="_blank" rel="noopener noreferrer">Visit the channel <span aria-hidden="true">↗</span></a>
            </div>
          </section>
        </aside>
      </div>
      <footer className="site-footer">
        <span>Tofu Auto Works <span className="footer-japanese" lang="ja">朝まで走れ</span></span>
        <span>Thanks for stopping by.</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </main>
  );
}
