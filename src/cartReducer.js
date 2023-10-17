export default function cartReducer(cart, action) {
    switch (action.type) {
        case "empty":
            return [];
        case "add": {
            debugger;
            const { id, sku } = action;
            const itemInCart = cart.find((i) => i.sku);

            if (!itemInCart) {
                return [...cart, { id, sku, quantity: 1 }];
            }

            return cart.map((i) =>
                i.sku === sku ? { ...i, quantity: i.quantity + 1 } : i
            );
        }
        case "updateQuantity": {
            const { quantity, sku } = action;

            if (quantity === 0) {
                return cart.filter((i) => i.sku !== sku);
            }

            return cart.map((i) => (i.sku === sku ? { ...i, quantity } : i));
        }
        default:
            throw Error("Unhandled action " + action.type);
    }
}