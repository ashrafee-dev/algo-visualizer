from collections import defaultdict, deque
from heapq import heappush, heappop


class Graph:
    """Simple and professional Graph implementation for students."""
    
    def __init__(self, directed=False, weighted=False):
        self.directed = directed
        self.weighted = weighted
        self.adj = defaultdict(list)  # adjacency list
        self.vertices = set()
        self.edges = 0
    
    def add_edge(self, u, v, w=1.0):
        """Add edge u->v with weight w."""
        if not self.weighted:
            w = 1.0
        
        self.vertices.add(u)
        self.vertices.add(v)
        self.adj[u].append((v, w))
        
        if not self.directed:
            self.adj[v].append((u, w))
        
        self.edges += 1
    
    def get_neighbors(self, v):
        """Get neighbors of vertex v."""
        return self.adj[v]
    
    def bfs(self, start):
        """Breadth-First Search from start vertex."""
        if start not in self.vertices:
            return []
        
        visited = set()
        queue = deque([start])
        visited.add(start)
        result = []
        
        while queue:
            v = queue.popleft()
            result.append(v)
            
            for neighbor, _ in self.adj[v]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        return result
    
    def dfs(self, start):
        """Depth-First Search from start vertex."""
        if start not in self.vertices:
            return []
        
        visited = set()
        stack = deque([start])
        visited.add(start)
        result = []
        
        while stack:
            v = stack.pop()
            result.append(v)
            
            for neighbor, _ in self.adj[v]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    stack.append(neighbor)
        
        return result
    
    def dijkstra(self, start):
        """Dijkstra's shortest path algorithm."""
        if not self.weighted:
            return self._bfs_shortest(start)
        
        if start not in self.vertices:
            return {}, {}
        
        dist = {v: float('inf') for v in self.vertices}
        dist[start] = 0
        prev = {v: None for v in self.vertices}
        pq = [(0, start)]
        
        while pq:
            d, v = heappop(pq)
            if d > dist[v]:
                continue
            
            for neighbor, w in self.adj[v]:
                if dist[v] + w < dist[neighbor]:
                    dist[neighbor] = dist[v] + w
                    prev[neighbor] = v
                    heappush(pq, (dist[neighbor], neighbor))
        
        return dist, prev
    
    def bellman_ford(self, start):
        """Bellman-Ford algorithm (handles negative weights)."""
        if not self.weighted or start not in self.vertices:
            return {}, {}
        
        dist = {v: float('inf') for v in self.vertices}
        dist[start] = 0
        prev = {v: None for v in self.vertices}
        
        # Relax edges |V|-1 times
        for _ in range(len(self.vertices) - 1):
            for u in self.vertices:
                for v, w in self.adj[u]:
                    if dist[u] != float('inf') and dist[u] + w < dist[v]:
                        dist[v] = dist[u] + w
                        prev[v] = u
        
        # Check for negative cycles
        for u in self.vertices:
            for v, w in self.adj[u]:
                if dist[u] != float('inf') and dist[u] + w < dist[v]:
                    raise ValueError("Negative cycle detected")
        
        return dist, prev
    
    def prim(self, start):
        """Prim's Minimum Spanning Tree algorithm."""
        if not self.weighted or start not in self.vertices:
            return []
        
        visited = set()
        mst = []
        pq = [(0, start, None)]
        
        while pq and len(visited) < len(self.vertices):
            w, v, parent = heappop(pq)
            
            if v in visited:
                continue
            
            visited.add(v)
            if parent is not None:
                mst.append((parent, v, w))
            
            for neighbor, weight in self.adj[v]:
                if neighbor not in visited:
                    heappush(pq, (weight, neighbor, v))
        
        return mst
    
    def kruskal(self):
        """Kruskal's Minimum Spanning Tree algorithm."""
        if not self.weighted:
            return []
        
        # Collect all edges
        edges = []
        for u in self.vertices:
            for v, w in self.adj[u]:
                if not self.directed or u < v:
                    edges.append((w, u, v))
        
        edges.sort()
        
        # Union-Find
        parent = {v: v for v in self.vertices}
        rank = {v: 0 for v in self.vertices}
        
        def find(v):
            if parent[v] != v:
                parent[v] = find(parent[v])
            return parent[v]
        
        def union(u, v):
            pu, pv = find(u), find(v)
            if pu == pv:
                return False
            if rank[pu] < rank[pv]:
                parent[pu] = pv
            elif rank[pu] > rank[pv]:
                parent[pv] = pu
            else:
                parent[pv] = pu
                rank[pu] += 1
            return True
        
        mst = []
        for w, u, v in edges:
            if union(u, v):
                mst.append((u, v, w))
                if len(mst) == len(self.vertices) - 1:
                    break
        
        return mst
    
    def topological_sort(self):
        """Topological sort using Kahn's algorithm."""
        if not self.directed:
            raise ValueError("Topological sort requires directed graph")
        
        # Calculate in-degrees
        in_degree = {v: 0 for v in self.vertices}
        for u in self.vertices:
            for v, _ in self.adj[u]:
                in_degree[v] += 1
        
        # Process vertices with no incoming edges
        queue = deque([v for v in self.vertices if in_degree[v] == 0])
        result = []
        
        while queue:
            v = queue.popleft()
            result.append(v)
            
            for neighbor, _ in self.adj[v]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        if len(result) != len(self.vertices):
            raise ValueError("Graph has cycles")
        
        return result
    
    def has_cycle(self):
        """Check if graph contains a cycle."""
        if not self.directed:
            return self._has_cycle_undirected()
        return self._has_cycle_directed()
    
    def _has_cycle_undirected(self):
        """Check for cycles in undirected graph."""
        visited = set()
        
        def dfs(v, parent):
            visited.add(v)
            for neighbor, _ in self.adj[v]:
                if neighbor not in visited:
                    if dfs(neighbor, v):
                        return True
                elif neighbor != parent:
                    return True
            return False
        
        for v in self.vertices:
            if v not in visited and dfs(v, None):
                return True
        return False
    
    def _has_cycle_directed(self):
        """Check for cycles in directed graph."""
        visited = set()
        rec_stack = set()
        
        def dfs(v):
            visited.add(v)
            rec_stack.add(v)
            
            for neighbor, _ in self.adj[v]:
                if neighbor not in visited:
                    if dfs(neighbor):
                        return True
                elif neighbor in rec_stack:
                    return True
            
            rec_stack.remove(v)
            return False
        
        for v in self.vertices:
            if v not in visited and dfs(v):
                return True
        return False
    
    def shortest_path(self, start, end):
        """Get shortest path from start to end."""
        if not self.weighted:
            dist, prev = self._bfs_shortest(start)
        else:
            dist, prev = self.dijkstra(start)
        
        if dist[end] == float('inf'):
            return [], float('inf')
        
        # Reconstruct path
        path = []
        current = end
        while current is not None:
            path.append(current)
            current = prev[current]
        path.reverse()
        
        return path, dist[end]
    
    def _bfs_shortest(self, start):
        """BFS-based shortest path for unweighted graphs."""
        dist = {v: float('inf') for v in self.vertices}
        dist[start] = 0
        prev = {v: None for v in self.vertices}
        queue = deque([start])
        
        while queue:
            v = queue.popleft()
            for neighbor, _ in self.adj[v]:
                if dist[neighbor] == float('inf'):
                    dist[neighbor] = dist[v] + 1
                    prev[neighbor] = v
                    queue.append(neighbor)
        
        return dist, prev
    
    def is_connected(self):
        """Check if graph is connected."""
        if not self.vertices:
            return True
        
        start = next(iter(self.vertices))
        visited = set()
        
        def dfs(v):
            visited.add(v)
            for neighbor, _ in self.adj[v]:
                if neighbor not in visited:
                    dfs(neighbor)
        
        dfs(start)
        return len(visited) == len(self.vertices)
    
    def __str__(self):
        """String representation."""
        result = f"Graph(directed={self.directed}, weighted={self.weighted})\n"
        result += f"Vertices: {len(self.vertices)}, Edges: {self.edges}\n"
        
        for v in sorted(self.vertices):
            neighbors = [f"{u}({w})" if self.weighted else str(u) 
                        for u, w in self.adj[v]]
            result += f"{v} -> [{', '.join(neighbors)}]\n"
        
        return result
    
    def __repr__(self):
        return self.__str__()
    
    
