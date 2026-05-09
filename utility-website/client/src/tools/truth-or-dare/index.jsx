import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
const TRUTHS = ['What is your most embarrassing moment?','What is the biggest lie you ever told?','What is your secret talent?','Who was your first crush?','What is the weirdest food you have ever eaten?','What is your biggest fear?','Have you ever cheated on a test?','What is the most childish thing you still do?','What is the last thing you searched on your phone?','If you could be invisible for a day, what would you do?','What is a secret you have never told anyone?','What is the most trouble you have ever been in?','Who do you secretly admire?','What is the silliest thing you are afraid of?','What is your guilty pleasure?'];
const DARES = ['Do 20 pushups right now','Sing the chorus of your favorite song','Talk in an accent for the next 3 rounds','Let someone post anything on your social media','Do your best celebrity impression','Hold a plank for 30 seconds','Let someone draw on your face','Speak in a whisper for the next 2 rounds','Do a silly dance for 15 seconds','Call a friend and sing happy birthday','Eat a spoonful of a condiment','Try to lick your elbow','Talk without closing your mouth for 1 minute','Act like a robot for 2 minutes','Do jumping jacks for 30 seconds'];
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const TruthOrDare = () => {
  const [result, setResult] = useState(null);
  const [type, setType] = useState(null);
  const [anim, setAnim] = useState(false);
  const generate = (t) => { setAnim(true); setType(t); setTimeout(() => { setResult(t === 'truth' ? pick(TRUTHS) : pick(DARES)); setAnim(false); }, 500); };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🎭 Truth or Dare?</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => generate('truth')} className="btn btn-lg" style={{ background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', color: '#fff', padding: '16px 40px', fontSize: '1.125rem', borderRadius: 12 }}>😇 Truth</button>
          <button onClick={() => generate('dare')} className="btn btn-lg" style={{ background: 'linear-gradient(135deg,#EF4444,#F97316)', color: '#fff', padding: '16px 40px', fontSize: '1.125rem', borderRadius: 12 }}>🔥 Dare</button>
        </div>
        {result && !anim && (
          <div style={{ maxWidth: 500, padding: '32px 40px', background: type === 'truth' ? '#EFF6FF' : '#FEF2F2', borderRadius: 16, border: `2px solid ${type === 'truth' ? '#3B82F6' : '#EF4444'}`, animation: 'fadeSlideIn 0.3s ease' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: type === 'truth' ? '#3B82F6' : '#EF4444' }}>{type}</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 8, color: 'var(--neutral-800)' }}>{result}</p>
          </div>
        )}
        {anim && <div style={{ padding: 40, fontSize: '3rem', animation: 'spin 0.5s linear' }}>{type === 'truth' ? '😇' : '🔥'}</div>}
        <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </ToolPageWrapper>
  );
};
export default TruthOrDare;
