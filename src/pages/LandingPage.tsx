import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  Mail, 
  ExternalLink,
  Menu,
  X,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { auth, db, signInWithGoogle, logout } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, getDocFromServer } from 'firebase/firestore';
import { cn, handleFirestoreError, OperationType } from '../lib/utils';
import ErrorBoundary from '../components/ErrorBoundary';
import { Link } from 'react-router-dom';

// --- Components ---

const Navbar = ({ user }: { user: User | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-ehad-bg/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="ECHAD Logo" 
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if logo.png is not found
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.insertAdjacentHTML('afterbegin', '<div class="w-10 h-10 bg-ehad-primary rounded-full flex items-center justify-center text-white font-serif text-xl font-bold">하나</div><span class="font-serif text-2xl font-bold tracking-tight text-ehad-primary">ECHAD</span>');
            }}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#history" className="text-sm font-medium hover:text-ehad-accent transition-colors">에하드 이야기</a>
          <a href="#mission" className="text-sm font-medium hover:text-ehad-accent transition-colors">핵심 사역</a>
          <a href="#transparency" className="text-sm font-medium hover:text-ehad-accent transition-colors">투명한 선교</a>
          <a href="#action" className="text-sm font-medium hover:text-ehad-accent transition-colors">후원하기</a>
          
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-ehad-primary" referrerPolicy="no-referrer" />
                <span className="text-xs font-semibold">{user.displayName}</span>
              </div>
              <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="px-5 py-2 bg-ehad-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <UserIcon size={16} />
              로그인
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-ehad-bg border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            <a href="#history" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">에하드 이야기</a>
            <a href="#mission" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">핵심 사역</a>
            <a href="#transparency" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">투명한 선교</a>
            <a href="#action" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">후원하기</a>
            {user ? (
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-red-600 font-medium">로그아웃</button>
            ) : (
              <button onClick={() => { signInWithGoogle(); setIsMenuOpen(false); }} className="text-left text-ehad-primary font-medium">로그인</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionTitle = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("text-4xl md:text-5xl font-serif font-bold mb-4", light ? "text-white" : "text-ehad-primary")}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn("text-lg max-w-2xl", light ? "text-white/80" : "text-gray-600")}
      >
        {subtitle}
      </motion.p>
    )}
    <div className={cn("w-20 h-1 mt-6", light ? "bg-white/30" : "bg-ehad-primary/20")} />
  </div>
);

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter'), {
        email,
        subscribedAt: serverTimestamp()
      });
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'newsletter', auth);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthReady) return null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen selection:bg-ehad-primary/20">
        <Navbar user={user} />

        {/* 1. Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/mother-child/1920/1080" 
              alt="Mother and Child" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-6 border border-white/30"
            >
              에하드(ECHAD): 하나 된 세상
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
            >
              엄마가 일어서고,<br />아이가 꿈꾸는 하나 된 세상
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 mb-10 font-light"
            >
              25년의 사랑을 이어, 이제 에하드(ECHAD)가 소외된 여성의 자립과 아이들의 미래를 위한 통로가 됩니다.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/donate" 
                target="_blank" 
                className="px-8 py-4 bg-white text-ehad-primary rounded-full font-bold hover:bg-ehad-bg transition-colors shadow-lg"
              >
                지금 후원하기
              </Link>
              <a href="#history" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full font-bold hover:bg-white/20 transition-colors">
                에하드 이야기
              </a>
            </motion.div>
          </div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
          >
            <ChevronRight size={32} className="rotate-90" />
          </motion.div>
        </section>

        {/* 2. History & Identity */}
        <section id="history" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle 
                title="순교의 밀알이 싹틔운 25년의 헌신" 
                subtitle="한나바자회와 다비다의 통합, 그리고 25년의 유산"
              />
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p>
                  에하드는 기니 선교사로 헌신하다 33세의 나이로 순교하신 한나 선교사님의 숭고한 뜻을 기리는 
                  <strong className="text-ehad-accent"> '한나바자회'</strong>와 
                  <strong className="text-ehad-accent"> '다비다'</strong>가 하나 되어 탄생했습니다.
                </p>
                <p>
                  한 선교사님의 사랑을 기억하며 지난 25년간 이어온 바자회의 정성이 이제는 '에하드(ECHAD)'라는 이름으로 더 넓은 세상을 향해 나아갑니다.
                </p>
                <div className="p-6 bg-ehad-bg rounded-2xl border-l-4 border-ehad-primary italic">
                  "히브리어로 '하나'를 뜻하는 에하드(ECHAD)는 선교 현장의 필요와 후원자의 마음을 하나로 잇는 신뢰의 공동체입니다."
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/legacy/800/1000" 
                  alt="Legacy" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-ehad-primary text-white p-8 rounded-3xl shadow-xl hidden lg:block">
                <p className="text-4xl font-serif font-bold mb-1">25+</p>
                <p className="text-sm uppercase tracking-widest opacity-80">Years of Legacy</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Mission 01: Women's Self-Reliance */}
        <section id="mission" className="py-24 px-6 bg-ehad-bg">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
              <motion.div
                initial={{ opacity: 0, order: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="md:order-2"
              >
                <div className="flex items-center gap-3 text-ehad-accent mb-4">
                  <Heart size={24} />
                  <span className="font-bold tracking-widest uppercase text-sm">핵심 사역 01</span>
                </div>
                <SectionTitle 
                  title="빵이 아닌, '빵 만드는 법'을 선물합니다" 
                  subtitle="필리핀 카비테 CAMC & 레바논 엘림 센터"
                />
                <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                  <p>
                    단순한 구호물품 전달은 일시적인 도움일 뿐입니다. 에하드는 레바논 엘림 센터의 뜨개질 교실과 필리핀 카비테 CAMC 프로젝트를 통해 여성들에게 기술을 교육하고 일자리를 창출합니다.
                  </p>
                  <p>
                    엄마의 경제적 자립은 가정의 회복을 가져오고, 마을 전체를 변화시키는 시작점이 됩니다.
                  </p>
                  <div className="flex gap-3 pt-4">
                    {['#여성자립', '#기술교육', '#가정회복'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-ehad-primary border border-ehad-primary/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:order-1"
              >
                <div className="grid grid-cols-2 gap-4">
                  <img src="https://picsum.photos/seed/women1/400/500" alt="Women training" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
                  <img src="https://picsum.photos/seed/women2/400/500" alt="Women working" className="rounded-2xl shadow-lg mt-8" referrerPolicy="no-referrer" />
                </div>
              </motion.div>
            </div>

            {/* 4. Mission 02: Children's Education */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 text-ehad-accent mb-4">
                  <BookOpen size={24} />
                  <span className="font-bold tracking-widest uppercase text-sm">핵심 사역 02</span>
                </div>
                <SectionTitle 
                  title="가난의 대물림을 끊는 가장 확실한 도구, 교육" 
                  subtitle="필리핀 카비테 CAMC DCC(Day Care Center)"
                />
                <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                  <p>
                    아무런 준비 없이 학교로 향하는 아이들이 없도록, 에하드는 필리핀 카비테 CAMC DCC와 협력하여 학용품 지원 및 교육 환경 개선 사업을 펼칩니다.
                  </p>
                  <p>
                    쾌적한 환경에서 배우고 꿈꿀 수 있는 권리를 되찾아주어, 아이들이 훗날 공동체를 이끄는 건강한 리더로 성장하도록 돕습니다.
                  </p>
                  <div className="flex gap-3 pt-4">
                    {['#교육환경개선', '#학용품지원', '#미래세대양육'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-ehad-primary border border-ehad-primary/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <img src="https://picsum.photos/seed/children/800/600" alt="Children education" className="rounded-3xl shadow-2xl" referrerPolicy="no-referrer" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-ehad-accent rounded-full flex items-center justify-center text-white p-4 text-center text-xs font-bold leading-tight rotate-12">
                    DCC PROJECT
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. Transparency */}
        <section id="transparency" className="py-24 px-6 bg-ehad-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <ShieldCheck size={64} className="mx-auto mb-6 text-white/40" />
              <SectionTitle 
                title="정직함이 에하드의 자부심입니다" 
                light
              />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "25년의 전통", desc: "바자회의 정직한 정성을 그대로 이어갑니다." },
                { title: "투명한 회계", desc: "1원 한 장도 헛되이 쓰이지 않도록 체계적으로 관리합니다." },
                { title: "시각화 보고", desc: "매월 현장의 열매를 시각화된 보고서로 공개합니다." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20"
                >
                  <h3 className="text-2xl font-serif font-bold mb-4">{item.title}</h3>
                  <p className="text-white/70">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 text-center text-xl font-light max-w-3xl mx-auto leading-relaxed"
            >
              "에하드는 후원자님의 기도가 현장에 어떻게 심기고 열매 맺는지 가장 정직하게 보고합니다. 
              모든 과정을 투명하게 공개하여 신뢰의 공동체를 만들어갑니다."
            </motion.p>
          </div>
        </section>

        {/* 6. Action: Donation & Newsletter */}
        <section id="action" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
            {/* Donation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-ehad-bg rounded-[2.5rem] border border-ehad-primary/5"
            >
              <h3 className="text-3xl font-serif font-bold text-ehad-primary mb-6">지금, 에하드의 동역자가 되어주세요</h3>
              <p className="text-gray-600 mb-10 text-lg">"오늘 당신이 나누는 작은 사랑이 한 가정의 미래를 바꿉니다."</p>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-ehad-primary/10 mb-8">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">후원 계좌 (하나은행)</p>
                <p className="text-2xl font-bold text-ehad-primary mb-1">247-910033-14004</p>
                <p className="text-gray-600">예금주: 에하드</p>
              </div>

              <Link 
                to="/donate" 
                target="_blank" 
                className="w-full py-4 bg-ehad-primary text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-ehad-primary/20"
              >
                지금 후원하기 <ExternalLink size={20} />
              </Link>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <div className="mb-8">
                <div className="w-16 h-16 bg-ehad-accent/10 rounded-2xl flex items-center justify-center text-ehad-accent mb-6">
                  <Mail size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-ehad-primary mb-4">에하드 소식 구독하기</h3>
                <p className="text-gray-600 text-lg">현장의 생생한 소식과 투명한 보고서를 매월 이메일로 보내드립니다.</p>
              </div>

              {subscribed ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-8 bg-green-50 border border-green-100 rounded-3xl text-center"
                >
                  <p className="text-green-800 font-bold text-lg mb-2">구독해주셔서 감사합니다!</p>
                  <p className="text-green-600">에하드의 소중한 동역자가 되어주셔서 기릅니다.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      placeholder="이메일 주소를 입력해주세요"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 bg-ehad-bg border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-ehad-primary/20 transition-all text-lg"
                    />
                  </div>
                  <button 
                    disabled={submitting}
                    className="w-full py-4 bg-ehad-accent text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? '처리 중...' : '뉴스레터 구독하기'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-ehad-bg border-t border-gray-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="ECHAD Logo" 
                className="h-8 w-auto object-contain opacity-80"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.insertAdjacentHTML('afterbegin', '<div class="w-8 h-8 bg-ehad-primary rounded-full flex items-center justify-center text-white font-serif text-sm font-bold">하나</div><span class="font-serif text-xl font-bold tracking-tight text-ehad-primary">ECHAD</span>');
                }}
              />
            </div>
            
            <div className="text-gray-500 text-xs text-center md:text-right space-y-1">
              <p>© 2026 ECHAD. All rights reserved.</p>
              <p>단체명: 에하드 | 대표자: 이지숙 | 고유번호: 622-82-72654</p>
              <p>소재지: 서울특별시 성동구 성수일로10길 33, 911호(성수동2가, 기독교대한성결교회성락성결교회)</p>
              <p className="mt-1">엄마가 일어서고, 아이가 꿈꾸는 하나 된 세상</p>
            </div>

            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-ehad-primary transition-colors"><Users size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-ehad-primary transition-colors"><Heart size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-ehad-primary transition-colors"><ShieldCheck size={20} /></a>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
