import prisma from "@/lib/db";

const WEBSITE_LIMIT = 5; // Лимит для пользователей без подписки

// Функция для проверки, можно ли создать новый сайт
export const canCreateWebsite = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) throw new Error("User not found");


    if (user.isVip) {
        return true;
    }


    const createdWebsites = user.websitesCreated;
    if (createdWebsites >= WEBSITE_LIMIT) {
        throw new Error("You have reached the limit of 5 websites. Please subscribe to create more.");
    }

    return true;
};


export const incrementWebsitesCreated = async (userId: string) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            websitesCreated: { increment: 1 }
        }
    });

    return user!;
};
