import { measureMemory } from "node:vm";
import { Graph } from "../model/graph";
import { Layout } from "./layout";
import { matchesGlob } from "node:path";

export class MindMapLayout extends Layout {

    constructor(graph: Graph, width: number, height: number) {
        console.log("MindMapLayout!");
        super(graph, width, height);
    }

    stepSimulation(): number {
        const nodes = this.graph.getNodes();
        const edges = this.graph.getEdges();
        const connectedIds = this.getConnectedNodeIds();

        let totalMovement = 0;

        // Repulsion
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];

                a.velocity ??= { vx: 0, vy: 0 };
                b.velocity ??= { vx: 0, vy: 0 };

                const dx = b.position.x - a.position.x;
                const dy = b.position.y - a.position.y;

                const distSq = dx * dx + dy * dy || 0.01;
                const distance = Math.sqrt(distSq);

                const force = 250 * (a.weight + b.weight) / distSq;

                let fx = (dx / distance) * force;
                let fy = (dy / distance) * force;

                // Check for overlap
                const a_left = a.position.x - a.size.width / 2;
                const a_right = a.position.x + a.size.width / 2;
                const a_top = a.position.y - a.size.height / 2;
                const a_bottom = a.position.y + a.size.height / 2;
                const b_left = b.position.x - b.size.width / 2;
                const b_right = b.position.x + b.size.width / 2;
                const b_top = b.position.y - b.size.height / 2;
                const b_bottom = b.position.y + b.size.height / 2;

                const xOverlap = Math.min(a_right, b_right) - Math.max(a_left, b_left);
                const yOverlap = Math.min(a_bottom, b_bottom) - Math.max(a_top, b_top);

                const overlaps = xOverlap > 0 && yOverlap > 0;

                if (overlaps) {
                    const push = 0.05;
                    const overlapForce = Math.min(xOverlap, yOverlap) * push;

                    fx += (dx / distance) * overlapForce;
                    fy += (dy / distance) * overlapForce;
                }

                if (a.type !== "level-0") {
                    a.velocity.vx -= fx;
                    a.velocity.vy -= fy;
                }
                if (b.type !== "level-0") {
                    b.velocity.vx += fx;
                    b.velocity.vy += fy;
                }
            }
        }

        // Springs only for connected nodes via edges
        for (const edge of edges) {
            const a = nodes.find((node) => node.id === edge.from);
            const b = nodes.find((node) => node.id === edge.to);

            if (!a || !b) continue;

            a.velocity ??= { vx: 0, vy: 0 };
            b.velocity ??= { vx: 0, vy: 0 };

            const dx = b.position.x - a.position.x;
            const dy = b.position.y - a.position.y;

            const distSq = dx * dx + dy * dy || 0.01;
            const distance = Math.sqrt(distSq);

            const idealLength = 90;
            const springStrength = 0.005 * Math.sqrt(nodes.length);

            let force = springStrength * (distance - idealLength);

            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            if (a.type !== "level-0") {
                a.velocity.vx += fx;
                a.velocity.vy += fy;
            }
            if (b.type !== "level-0") {
                b.velocity.vx -= fx;
                b.velocity.vy -= fy;
            }
        }

        const outwardPush = 0.0002;

        for (const node of nodes) {
            const fx = outwardPush;
            const fy = outwardPush;

            // Apply a small outwards push to every node
            node.velocity ??= { vx: 0, vy: 0 };
            node.velocity.vx -= fx;
            node.velocity.vy -= fy;

            // Damp the velocity slighty to give things chance to settle
            const damping = 0.75;
            const maxSpeed = 5;
            const minSpeed = 0.01;

            node.velocity.vx *= damping;
            node.velocity.vy *= damping;

            const speed = Math.sqrt(
                node.velocity.vx * node.velocity.vx +
                node.velocity.vy * node.velocity.vy
            );

            if (speed > maxSpeed) {
                node.velocity.vx = (node.velocity.vx / speed) * maxSpeed;
                node.velocity.vy = (node.velocity.vy / speed) * maxSpeed;
            }

            if (Math.abs(node.velocity.vx) < minSpeed) node.velocity.vx = 0;
            if (Math.abs(node.velocity.vy) < minSpeed) node.velocity.vy = 0;

            node.position.x += node.velocity.vx;
            node.position.y += node.velocity.vy;

            totalMovement += Math.abs(node.velocity.vx) + Math.abs(node.velocity.vy);
        }

        return totalMovement;
    }
}