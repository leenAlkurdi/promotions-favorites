export type Promotion = {
    id: string;
    title: string;
    merchant: string;
    rewardAmount: number;
    rewardCurrency: string;
    description: string;
    terms: string;
    thumbnailUrl: string;
    expiresAt: string;
    isFavorite?: boolean;
}