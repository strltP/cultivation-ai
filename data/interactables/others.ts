import type { InteractableTemplate } from '../../../types/interaction';

export const OTHERS: InteractableTemplate[] = [
    // === Dược Viên ===
    {
        baseId: 'spirit_field_plot',
        name: 'Linh Điền',
        type: 'spirit_field',
        prompt: 'Một thửa ruộng màu mỡ, tràn đầy linh khí, thích hợp để trồng linh thảo.',
        // Loot is handled by harvesting, not by direct interaction
    },

    // === Alchemy Furnace ===
    {
        baseId: 'alchemy_furnace',
        name: 'Đan Lô',
        type: 'alchemy_furnace',
        prompt: 'Một chiếc đan lô cổ xưa, tỏa ra mùi thuốc nồng đậm. Có thể dùng để luyện đan.',
    },

    // === Other Maps ===
    {
        baseId: 'chest_bi_lang_quen',
        name: 'Rương Bị Lãng Quên',
        type: 'chest',
        prompt: 'Chiếc rương này làm bằng gỗ đen, xù xì và được buộc bằng sắt gỉ. Cảm giác cổ xưa và phát ra một luồng khí bí ẩn mờ nhạt. Ai biết nó chứa đựng bí mật gì bên trong?',
        // No loot table, this will use Gemini API. Respawn is handled manually in useInteractionManager
    },
];
