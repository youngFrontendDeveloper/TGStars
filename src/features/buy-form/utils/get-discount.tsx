export const getDiscount = (spent: number) => {
	if (spent > 300_000) {
		return 5;
	}

	if (spent > 75_000) {
		return 4;
	}

	if (spent > 25_000) {
		return 3;
	}

	if (spent > 10_000) {
		return 2;
	}

	if (spent > 1000) {
		return 1;
	}

	return 0;
};
