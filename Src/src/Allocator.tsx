// This is the allocator which administrates the IDs to requests.

var Allocator_Instances: Map<string, number> = new Map<string, number>();
var Non_Linear_Allocation: Map<string, Map<number, boolean>> = new Map<string, Map<number, boolean>>();

export const Instance = {
    PAPER: "PAPER",
    AUTHOR: "AUTHOR",
    PAPER_AND_AUTHOR: "PAPER_AND_AUTHOR",
}

export function Allocate(Instance: string): number{

    // if requested instance is not present them make new one, if it is already present, then return the new ID
    if (!Allocator_Instances.has(Instance)){
        Allocator_Instances.set(Instance, 0);
    }

    // Get the current ID of the instance
    let Current_ID = Allocator_Instances.get(Instance)!;

    let New_ID = Current_ID + 1;

    // Check if some loaded papers already hold this ID
    if (Non_Linear_Allocation.has(Instance)){
        let Non_Linear_Allocation_Instance = Non_Linear_Allocation.get(Instance)!;

        while (Non_Linear_Allocation_Instance.has(New_ID)){
            New_ID++;
        }
    }

    // Increment the ID
    Allocator_Instances.set(Instance, New_ID);

    // Return the new ID
    return New_ID;
}

export function Preserve(Instance: string, id: number){
    Non_Linear_Allocation.set(Instance, new Map<number, boolean>());

    let Non_Linear_Allocation_Instance = Non_Linear_Allocation.get(Instance)!;

    Non_Linear_Allocation_Instance.set(id, true);
}

export function Overlaps(Instance: string, id: number): boolean{
    if (Non_Linear_Allocation.has(Instance)){
        let Non_Linear_Allocation_Instance = Non_Linear_Allocation.get(Instance)!;

        return Non_Linear_Allocation_Instance.has(id);
    }

    return false;
}
