const usedNumbersPerDay: Record<string, Set<number>> = {};

export function getRandomIntUniquePerDay(min: number, max: number): number {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  if (!usedNumbersPerDay[today]) {
    usedNumbersPerDay[today] = new Set<number>();
  }

  const attempts = 100; // Pour éviter une boucle infinie

  for (let i = 0; i < attempts; i++) {
    const random = Math.floor(Math.random() * (max - min + 1)) + min;

    if (!usedNumbersPerDay[today].has(random)) {
      usedNumbersPerDay[today].add(random);
      return random;
    }
  }

  throw new Error("Plus de nombres uniques disponibles pour aujourd'hui !");
}
