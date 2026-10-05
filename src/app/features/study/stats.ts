import type { Question, StudySession, StudyStats, TopicStat, TrendPoint } from './models';

/**
 * Practice-bank readiness. Test-bank items are excluded so exam-only
 * questions cannot inflate the dashboard. Mirrors the prototype formula:
 * readiness = round(accuracy * 0.6 + coverage * 0.25 + lastExam * 0.15).
 */
export function computeStats(
  questions: readonly Question[],
  sessions: readonly StudySession[],
  topics: readonly string[],
  stateCode: string,
): StudyStats {
  const inScope = questions.filter((question) => question.states.includes(stateCode));
  const practiceIds = new Set(
    inScope.filter((question) => question.bank === 'practice').map((question) => question.id),
  );
  const byId = new Map(inScope.map((question) => [question.id, question]));

  let total = 0;
  let correct = 0;
  const topicTally = new Map<string, [number, number]>();
  const latest = new Map<string, 0 | 1>();
  const attempted = new Set<string>();
  const trend: TrendPoint[] = [];

  for (const session of sessions) {
    let sessionCorrect = 0;
    let sessionTotal = 0;
    for (const [id, result] of Object.entries(session.results)) {
      if (!practiceIds.has(id)) {
        continue;
      }
      const question = byId.get(id);
      if (!question) {
        continue;
      }
      const tally = topicTally.get(question.topic) ?? [0, 0];
      tally[1] += 1;
      if (result) {
        tally[0] += 1;
      }
      topicTally.set(question.topic, tally);
      total += 1;
      if (result) {
        correct += 1;
      }
      sessionCorrect += result;
      sessionTotal += 1;
      latest.set(id, result);
      attempted.add(id);
    }
    if (sessionTotal) {
      trend.push({
        date: session.date,
        acc: Math.round((sessionCorrect / sessionTotal) * 100),
        n: sessionTotal,
        mode: session.mode,
      });
    }
  }

  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const coverage = practiceIds.size ? Math.round((attempted.size / practiceIds.size) * 100) : 0;
  const missed = [...latest.entries()].flatMap(([id, result]) => {
    if (result) {
      return [];
    }
    const question = byId.get(id);
    return question ? [question] : [];
  });
  const topicStats: TopicStat[] = topics
    .map((topic) => {
      const [right, attempts] = topicTally.get(topic) ?? [0, 0];
      return { topic, acc: attempts ? Math.round((right / attempts) * 100) : 0, n: attempts };
    })
    .sort((a, b) => a.acc - b.acc);
  const examTrend = sessions.flatMap((session) =>
    session.mode === 'exam' && session.score != null
      ? [{ date: session.date, score: session.score }]
      : [],
  );
  const lastExam = examTrend.at(-1)?.score ?? 0;
  const readiness = Math.round(accuracy * 0.6 + coverage * 0.25 + lastExam * 0.15);
  const bestExam = examTrend.length ? Math.max(...examTrend.map((point) => point.score)) : null;
  const delta = trend.length > 1 ? (trend.at(-1)?.acc ?? 0) - trend[0].acc : 0;
  const modeSplit = { exam: 0, quiz: 0 };
  for (const point of trend) {
    modeSplit[point.mode] += point.n;
  }

  return {
    accuracy,
    coverage,
    missed,
    topics: topicStats,
    trend,
    examTrend,
    readiness,
    volume: total,
    bestExam,
    delta,
    modeSplit,
    sessionCount: sessions.length,
  };
}
