import { QUESTIONS, SESSIONS, TOPICS } from './catalog.mock';
import { computeStats } from './stats';

describe('computeStats', () => {
  const stats = computeStats(QUESTIONS, SESSIONS, TOPICS, 'NC');

  it('uses the prototype readiness weights and ignores the test bank', () => {
    const lastExam = stats.examTrend.at(-1)?.score ?? 0;
    expect(stats.readiness).toBe(
      Math.round(stats.accuracy * 0.6 + stats.coverage * 0.25 + lastExam * 0.15),
    );
    expect(stats.examTrend.map((point) => point.score)).toEqual([58, 67, 78]);
    expect(stats.bestExam).toBe(78);
    expect(stats.sessionCount).toBe(SESSIONS.length);
    expect(stats.missed.every((question) => question.bank === 'practice')).toBe(true);
    expect(stats.topics.map((topic) => topic.topic)).toEqual(
      [...stats.topics].sort((a, b) => a.acc - b.acc).map((topic) => topic.topic),
    );

    const practiceIds = new Set(
      QUESTIONS.filter((question) => question.bank === 'practice' && question.states.includes('NC')).map(
        (question) => question.id,
      ),
    );
    let volume = 0;
    for (const session of SESSIONS) {
      volume += Object.keys(session.results).filter((id) => practiceIds.has(id)).length;
    }
    expect(stats.volume).toBe(volume);
    expect(volume).toBeLessThan(
      SESSIONS.reduce((sum, session) => sum + Object.keys(session.results).length, 0),
    );
  });
});
