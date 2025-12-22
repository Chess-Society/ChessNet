<script lang="ts">
    import { onMount } from "svelte";
    import { Chess, SQUARES } from "chess.js";
    import { Chessground } from "chessground";
    import "chessground/assets/chessground.base.css";
    import "chessground/assets/chessground.brown.css";
    import "chessground/assets/chessground.cburnett.css";

    let boardContainer: HTMLElement;
    let ground: any;
    let chess = new Chess();

    function toDests(chess: Chess) {
        const dests = new Map();
        SQUARES.forEach((s) => {
            const ms = chess.moves({ square: s, verbose: true });
            if (ms.length)
                dests.set(
                    s,
                    ms.map((m) => m.to),
                );
        });
        return dests;
    }

    function toColor(chess: Chess): "white" | "black" {
        return chess.turn() === "w" ? "white" : "black";
    }

    function playRandomMove() {
        const moves = chess.moves();
        if (moves.length > 0) {
            const move = moves[Math.floor(Math.random() * moves.length)];
            chess.move(move);
            updateBoard();
        }
    }

    function updateBoard() {
        if (!ground) return;
        const config = {
            fen: chess.fen(),
            turnColor: toColor(chess),
            movable: {
                color: toColor(chess),
                dests: toDests(chess),
            },
        } as const;
        ground.set(config);
    }

    onMount(() => {
        if (boardContainer) {
            const config = {
                fen: chess.fen(),
                movable: {
                    color: "white",
                    free: false,
                    dests: toDests(chess),
                    events: {
                        after: (orig: any, dest: any) => {
                            try {
                                chess.move({ from: orig, to: dest });
                                updateBoard();
                                setTimeout(() => playRandomMove(), 500);
                            } catch (e) {
                                console.error("Invalid move", e);
                                updateBoard();
                            }
                        },
                    },
                },
            };
            // Cast to any to avoid strict Config type mismatch if types are slightly off
            ground = Chessground(boardContainer, config as any);
        }
    });
</script>

<div class="flex flex-col items-center gap-4">
    <div
        class="w-[600px] h-[600px] bg-slate-200 rounded shadow-xl overflow-hidden"
        bind:this={boardContainer}
    ></div>
    <div class="flex gap-2">
        <button
            onclick={() => {
                chess.reset();
                updateBoard();
            }}
            class="px-4 py-2 bg-secondary text-white rounded cursor-pointer hover:opacity-90"
            >Reiniciar</button
        >
        <button
            onclick={playRandomMove}
            class="px-4 py-2 bg-primary text-white rounded cursor-pointer hover:opacity-90"
            >Mover IA (Random)</button
        >
    </div>
</div>
