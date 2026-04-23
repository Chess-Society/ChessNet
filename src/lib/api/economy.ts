import { db } from "$lib/firebase";
import { 
  doc, 
  runTransaction, 
  collection, 
  addDoc, 
  serverTimestamp,
  increment
} from "firebase/firestore";

export const economyApi = {
  /**
   * Envía una propina (Tip) de un usuario a otro.
   * Utiliza una transacción para asegurar que ambos saldos se actualicen correctamente.
   */
  async sendTip(fromUserId: string, toUserId: string, amount: number, postId?: string): Promise<void> {
    if (amount <= 0) throw new Error("La cantidad debe ser mayor a cero.");
    if (fromUserId === toUserId) throw new Error("No puedes enviarte propinas a ti mismo.");

    const fromRef = doc(db, "economies", fromUserId);
    const toRef = doc(db, "economies", toUserId);
    
    await runTransaction(db, async (transaction) => {
      const fromSnap = await transaction.get(fromRef);
      const toSnap = await transaction.get(toRef);

      if (!fromSnap.exists()) throw new Error("El usuario emisor no tiene cuenta económica.");
      if (!toSnap.exists()) throw new Error("El usuario receptor no tiene cuenta económica.");

      const fromData = fromSnap.data();
      if (fromData.nets < amount) {
        throw new Error("Saldo insuficiente de Nets.");
      }

      // 1. Descontar del emisor
      transaction.update(fromRef, {
        nets: increment(-amount),
        lastUpdated: serverTimestamp()
      });

      // 2. Añadir al receptor
      transaction.update(toRef, {
        nets: increment(amount),
        lastUpdated: serverTimestamp()
      });

      // 3. Registrar transacción
      const txRef = doc(collection(db, "nets_transactions"));
      transaction.set(txRef, {
        userId: fromUserId,
        targetUserId: toUserId,
        amount: amount,
        type: 'TIP_SEND',
        postId: postId || null,
        description: `Propina enviada a ${toUserId}`,
        createdAt: serverTimestamp()
      });

      const txReceiveRef = doc(collection(db, "nets_transactions"));
      transaction.set(txReceiveRef, {
        userId: toUserId,
        sourceUserId: fromUserId,
        amount: amount,
        type: 'TIP_RECEIVE',
        postId: postId || null,
        description: `Propina recibida de ${fromUserId}`,
        createdAt: serverTimestamp()
      });

      // 4. Actualizar total en el post si existe
      if (postId) {
        const postRef = doc(db, "faculty_stream", postId);
        transaction.update(postRef, {
          tipsTotal: increment(amount)
        });
      }
    });
  }
};
