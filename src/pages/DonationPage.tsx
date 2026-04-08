import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronLeft, CheckCircle2, CreditCard, Wallet, User as UserIcon } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { cn, handleFirestoreError, OperationType } from '../lib/utils';

const DonationPage = () => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<'regular' | 'once'>('regular');
  const [amount, setAmount] = useState<number | string>(30000);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amounts = [10000, 30000, 50000, 100000];

  const handleDonation = async () => {
    setIsSubmitting(true);
    try {
      const finalAmount = amount === 'custom' ? Number(customAmount) : Number(amount);
      await addDoc(collection(db, 'donations'), {
        userId: auth.currentUser?.uid || 'anonymous',
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        userBirthDate: formData.birthDate,
        amount: finalAmount,
        type,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setStep(3);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'donations', auth);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ehad-bg font-sans selection:bg-ehad-primary/20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => window.close()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ehad-primary rounded-full flex items-center justify-center text-white font-serif text-sm font-bold">하나</div>
            <span className="font-serif text-xl font-bold tracking-tight text-ehad-primary">ECHAD</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 font-bold",
                step >= s ? "bg-ehad-primary text-white shadow-lg shadow-ehad-primary/20" : "bg-white text-gray-400 border-2 border-gray-200"
              )}
            >
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-ehad-primary mb-2">후원 종류 선택</h2>
                <p className="text-gray-500">어떤 방식으로 아이들의 미래를 응원하시겠어요?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setType('regular')}
                  className={cn(
                    "p-6 rounded-3xl border-2 transition-all text-center group",
                    type === 'regular' ? "border-ehad-primary bg-ehad-primary/5" : "border-gray-100 bg-white hover:border-ehad-primary/30"
                  )}
                >
                  <div className={cn("w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors", type === 'regular' ? "bg-ehad-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-ehad-primary/10 group-hover:text-ehad-primary")}>
                    <Heart size={24} />
                  </div>
                  <span className={cn("font-bold block mb-1", type === 'regular' ? "text-ehad-primary" : "text-gray-600")}>정기후원</span>
                  <span className="text-xs text-gray-400">매월 꾸준한 사랑</span>
                </button>
                <button 
                  onClick={() => setType('once')}
                  className={cn(
                    "p-6 rounded-3xl border-2 transition-all text-center group",
                    type === 'once' ? "border-ehad-primary bg-ehad-primary/5" : "border-gray-100 bg-white hover:border-ehad-primary/30"
                  )}
                >
                  <div className={cn("w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors", type === 'once' ? "bg-ehad-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-ehad-primary/10 group-hover:text-ehad-primary")}>
                    <CreditCard size={24} />
                  </div>
                  <span className={cn("font-bold block mb-1", type === 'once' ? "text-ehad-primary" : "text-gray-600")}>일시후원</span>
                  <span className="text-xs text-gray-400">지금 바로 따뜻한 나눔</span>
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-700">후원 금액</h3>
                <div className="grid grid-cols-2 gap-3">
                  {amounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setAmount(amt); setCustomAmount(''); }}
                      className={cn(
                        "py-4 rounded-2xl border-2 font-bold transition-all",
                        amount === amt ? "border-ehad-primary bg-ehad-primary text-white" : "border-gray-100 bg-white text-gray-600 hover:border-ehad-primary/30"
                      )}
                    >
                      {amt.toLocaleString()}원
                    </button>
                  ))}
                  <button
                    onClick={() => setAmount('custom')}
                    className={cn(
                      "py-4 rounded-2xl border-2 font-bold transition-all col-span-2",
                      amount === 'custom' ? "border-ehad-primary bg-ehad-primary text-white" : "border-gray-100 bg-white text-gray-600 hover:border-ehad-primary/30"
                    )}
                  >
                    직접 입력
                  </button>
                </div>
                {amount === 'custom' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <input 
                      type="number" 
                      placeholder="금액을 입력해주세요 (원)"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ehad-primary/20 transition-all font-bold text-lg"
                    />
                  </motion.div>
                )}
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-5 bg-ehad-primary text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-xl shadow-ehad-primary/20"
              >
                다음 단계로
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-ehad-primary mb-2">후원자 정보 입력</h2>
                <p className="text-gray-500">소중한 나눔을 위해 정보를 확인해주세요.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ehad-primary/20 transition-all"
                    placeholder="성함을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">이메일</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ehad-primary/20 transition-all"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">휴대폰 번호</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ehad-primary/20 transition-all"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">생년월일</label>
                  <input 
                    type="text" 
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ehad-primary/20 transition-all"
                    placeholder="YYYYMMDD"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors"
                >
                  이전으로
                </button>
                <button 
                  onClick={handleDonation}
                  disabled={isSubmitting || !formData.name || !formData.email}
                  className="flex-[2] py-5 bg-ehad-accent text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-xl shadow-ehad-accent/20 disabled:opacity-50"
                >
                  {isSubmitting ? '처리 중...' : '후원 완료하기'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-serif font-bold text-ehad-primary mb-4">후원이 완료되었습니다!</h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {formData.name} 후원자님의 소중한 마음이<br />
                아이들의 꿈을 키우는 씨앗이 됩니다.<br />
                진심으로 감사드립니다.
              </p>
              
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-12 text-left">
                <div className="flex justify-between mb-4 pb-4 border-b border-gray-50">
                  <span className="text-gray-500">후원 종류</span>
                  <span className="font-bold">{type === 'regular' ? '정기후원' : '일시후원'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">후원 금액</span>
                  <span className="font-bold text-ehad-accent text-xl">
                    {(amount === 'custom' ? Number(customAmount) : Number(amount)).toLocaleString()}원
                  </span>
                </div>
              </div>

              <button 
                onClick={() => window.close()}
                className="w-full py-5 bg-ehad-primary text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-xl shadow-ehad-primary/20"
              >
                창 닫기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-xl mx-auto px-6 py-12 text-center text-gray-400 text-xs space-y-1">
        <p>© 2026 ECHAD. All rights reserved.</p>
        <p>단체명: 에하드 | 대표자: 이지숙 | 고유번호: 622-82-72654</p>
        <p>소재지: 서울특별시 성동구 성수일로10길 33, 911호(성수동2가, 기독교대한성결교회성락성결교회)</p>
        <p className="mt-1">에하드는 모든 후원 과정을 투명하게 공개합니다.</p>
      </footer>
    </div>
  );
};

export default DonationPage;
