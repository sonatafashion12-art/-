import React from 'react';
import { motion } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Heart, 
  ChevronLeft, 
  Gift, 
  MapPin, 
  Calendar,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';

const LightCampaign = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-ehad-primary/30">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70">
              <ChevronLeft size={24} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-ehad-primary rounded-full flex items-center justify-center text-white font-serif text-sm font-bold shadow-[0_0_15px_rgba(var(--ehad-primary-rgb),0.5)]">하나</div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">ECHAD</span>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[85vh] flex items-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 -z-20">
            <img 
              src="https://picsum.photos/seed/dramatic-hand-bulb-dark/1920/1080" 
              alt="Background" 
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-[#0A0A0A]" />
          </div>
          
          {/* Glowing Background Elements */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-ehad-primary/20 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-ehad-accent/10 rounded-full blur-[100px] -z-10" />

          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-ehad-accent text-sm font-bold mb-8 border border-white/20"
            >
              <Moon size={16} className="fill-ehad-accent" />
              <span>SPECIAL CAMPAIGN</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.15] tracking-tight"
            >
              어둠 속 한 가정에<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ehad-accent to-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">빛을 선물해주세요</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/70 mb-12 font-light leading-relaxed max-w-2xl mx-auto"
            >
              전기가 없는 필리핀 카비테 마을의 밤은 너무나도 깊습니다.<br className="hidden md:block" />
              아이들의 꿈이 어둠 속에 갇히지 않도록 빛의 통로가 되어주세요.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/donate" 
                className="px-10 py-5 bg-ehad-accent text-white rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(var(--ehad-accent-rgb),0.4)] hover:scale-105"
              >
                지금 빛 선물하기
              </Link>
              <a 
                href="https://blog.naver.com/openhandskr/224242260131" 
                target="_blank" 
                rel="noreferrer"
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                아웃리치 이야기 <ExternalLink size={20} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Campaign Info */}
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ y: -10 }}
                className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 text-center"
              >
                <div className="w-16 h-16 bg-ehad-accent/20 rounded-2xl flex items-center justify-center text-ehad-accent mx-auto mb-6">
                  <Sun size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">5만원의 기적</h3>
                <p className="text-white/60 font-light leading-relaxed">
                  5만원의 후원으로 전기가 없는 한 가정에<br />
                  밝은 LED 전등을 설치해 드립니다.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 text-center"
              >
                <div className="w-16 h-16 bg-ehad-primary/20 rounded-2xl flex items-center justify-center text-ehad-primary mx-auto mb-6">
                  <Heart size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">후원자의 이름</h3>
                <p className="text-white/60 font-light leading-relaxed">
                  설치된 전등에는 후원자님의 성함이<br />
                  함께 부착되어 감사의 마음을 전합니다.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400 mx-auto mb-6">
                  <Gift size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">에코백 증정</h3>
                <p className="text-white/60 font-light leading-relaxed">
                  에하드 정기 후원 회원 가입 시<br />
                  에하드 한정판 에코백을 선물로 드립니다.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 text-ehad-accent mb-6">
                <MapPin size={24} />
                <span className="font-bold tracking-widest uppercase text-sm">필리핀 카비테 아웃리치</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                2026년 3월,<br />
                우리가 만난 어둠 속의 희망
              </h2>
              <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
                <p>
                  에하드 회원 6명과 고등학생 자녀 1명이 오픈핸즈와 함께 필리핀 카비테 마을을 방문했습니다. 
                  그곳에서 우리가 마주한 것은 해가 지면 아무것도 할 수 없는 칠흑 같은 어둠이었습니다.
                </p>
                <p>
                  아이들은 촛불 하나에 의지해 숙제를 하고, 엄마들은 어둠 속에서 위험을 무릅쓰고 집안일을 해야 했습니다. 
                  우리는 그곳에 '빛'을 전하기로 했습니다.
                </p>
                <div className="p-8 bg-white/5 rounded-3xl border-l-4 border-ehad-accent italic text-ehad-accent/80 font-medium">
                  "전등 하나가 켜지는 순간, 아이들의 눈동자가 반짝였습니다.<br />
                  그것은 단순한 빛이 아니라, 내일을 꿈꿀 수 있는 희망이었습니다."
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/moody-hand-reaching-light/800/1200" 
                  alt="Hand reaching for light" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="relative group overflow-hidden rounded-3xl shadow-2xl mt-16">
                <img 
                  src="https://picsum.photos/seed/glowing-vintage-bulb-night/800/1200" 
                  alt="Glowing light bulb" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 bg-ehad-primary text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/stars/1920/1080')] opacity-10 mix-blend-overlay" />
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
              당신의 이름으로<br />빛을 밝혀주세요
            </h2>
            <p className="text-xl text-white/80 mb-12 font-light leading-relaxed">
              지금 후원하시면 필리핀 카비테 마을의 한 가정에<br />
              당신의 따뜻한 이름이 새겨진 빛이 전달됩니다.
            </p>
            <Link 
              to="/donate" 
              className="inline-block px-12 py-6 bg-white text-ehad-primary rounded-full font-bold text-xl hover:bg-ehad-bg transition-all shadow-2xl hover:scale-105"
            >
              지금 바로 참여하기
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center text-white/40 text-xs space-y-2">
            <p>© 2026 ECHAD. All rights reserved.</p>
            <p>단체명: 에하드 | 대표자: 이지숙 | 고유번호: 622-82-72654</p>
            <p>소재지: 서울특별시 성동구 성수일로10길 33, 911호(성수동2가, 기독교대한성결교회성락성결교회)</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default LightCampaign;
