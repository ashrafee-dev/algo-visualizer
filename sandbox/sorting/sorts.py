class Sort:
    def __init__(self, lst):
        self.lst = lst

    def swap( first, second, list ):
        temp = list[first]
        list[first] = list[second]
        list[second] = temp;


    def bubble_sort(self):
        """Return a sorted copy of self.lst using bubble sort."""
        local_lst = self.lst.copy()
        n = len( local_lst )

        for i in range( n-1 ):
            for j in range ( n-i-1 ):
                if local_lst[j] > local_lst[j+1]:
                    Sort.swap( j, j+1,local_lst )

        return local_lst

    def selection_sort(self):
        """Return a sorted copy of self.lst using selection sort."""
        local_lst = self.lst.copy()
        n = len( local_lst )

        for i in range( n-1 ):
            smallest = i
            for j in range ( i+1, n ):
                if local_lst[j] < local_lst[smallest]:
                    smallest = j
            Sort.swap(i, smallest, local_lst)

        return local_lst;


    def insertion_sort(self):
        """Return a sorted copy of self.lst using insertion sort."""
        local_lst = self.lst.copy()
        n = len( local_lst)

        for i in range( 1,n ):
            curr = i
            while curr>0 and local_lst[curr]< local_lst[curr-1]:
                Sort.swap( curr,curr-1,local_lst )
                curr -=1

        return local_lst

    def merge_sort_recursive(self):
        """Return a sorted copy of self.lst using merge sort(recursively)."""
        def _merge( left,right ):
            i = j = k = 0
            merged_lst = [0]*( len(left) + len(right) )

            # Handle Empty lists 
            if not left:
                return right
            elif not right:
                return left
                

            while i < len(left) and j < len(right):
                if left[i] > right[j]:
                    merged_lst[k] = right[j]
                    k += 1
                    j += 1
                else:
                    merged_lst[k] = left[i]
                    k += 1
                    i += 1
            # Append Remaining elements        
            if i < len(left):
                merged_lst[k:] = left[i:]
            elif j < len(right):
                merged_lst[k:] = right[j:]
            return merged_lst


        def _merge_sort(lst):
            if len( lst ) <= 1:
                return lst

            mid =  len( lst )//2 
            left_lst  = _merge_sort( lst[:mid] )
            right_lst = _merge_sort( lst[mid:] )

            merged_lst = _merge( left_lst,right_lst )
            return merged_lst

        local_lst = self.lst.copy()
        merged_lst = _merge_sort( local_lst )
        return merged_lst

    def merge_sort_iterative(self):
        print(self.lst)

    def quick_sort(self):
        print(self.lst)

    def shell_sort(self):
        print(self.lst)

    def heap_sort(self):
        print(self.lst)



