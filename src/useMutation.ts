import { useState } from 'react';
interface LocalDataMutators {
    addNewData?: (data: any) => void;
    updateExistingData?: (id: string | number, data: any) => void;
    deleteExistingData?: (id: string | number) => void;
}

export interface RemoteCrudFunctions {
    insertFn?: (data: any) => Promise<any>;
    updateFn?: (id: string | number, data: any) => Promise<void>;
    deleteFn?: (id: string | number) => Promise<void>;
}

interface CrudProps {
    local: LocalDataMutators;
    remote: RemoteCrudFunctions;
}

interface useMutationReturn {
    isAdding: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    addItem: (data: any) => Promise<void>;
    updateItem: (id: string | number, data: any) => Promise<void>;
    deleteItem: (id: string | number) => Promise<void>;
}

export const useMutation = (
    { local, remote }: CrudProps
): useMutationReturn => {
    // Destructure local and remote operations
    const { addNewData, updateExistingData, deleteExistingData } = local;
    const { insertFn, updateFn, deleteFn } = remote;

    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const addItem = async (data: any, dataKey?:string, onSuccess?:any): Promise<void> => {
        if (!insertFn || !addNewData) {
            console.warn("insertFn and addNewData is not provided. Skipping addItem.");
            return;
        }

        setIsAdding(true);
        try {
            const newItem = await insertFn(data);
            const dataToSave = dataKey ? newItem[dataKey] : newItem;
            addNewData(dataToSave); // update fetch state
            if (onSuccess) onSuccess(dataToSave);
        } finally {
            setIsAdding(false);
        }
    };

    const updateItem = async (id: string | number, data: any, dataKey?:string,): Promise<void> => {
        if (!updateFn || !updateExistingData) {
            console.warn("updateFn and updateExistingData is not provided. Skipping updateItem.");
            throw new Error("updateFn and updateExistingData is not provided. Skipping updateItem.");
        }
        if (!id || !data) {
            console.warn("ID and Data are  required for updateItem. Skipping.");
            return;
        }

        setIsUpdating(true);
        try {
            const updatedItem = await updateFn(id, data);
            const dataToSave = dataKey ? updatedItem[dataKey] : updatedItem;
            updateExistingData(id, dataToSave); // update fetch state
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteItem = async (id: string | number): Promise<void> => {
        if (!deleteFn || !deleteExistingData) {
            console.warn("deleteFn and deleteExistingData is not provided. Skipping deleteItem.");
            return;
        }
        if (!id) {
            console.warn("ID is required for deleteItem. Skipping.");
            return;
        }
        
        setIsDeleting(true);
        try {
            await deleteFn(id);
            deleteExistingData(id); // update fetch state
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        isAdding,
        isUpdating,
        isDeleting,
        addItem,
        updateItem,
        deleteItem
    };
};

// The useMutation hook is a custom React hook designed to handle CRUD (Create, Read, Update, Delete) operations by coordinating between local state and remote services. 
// It takes a single argument, which is an object with the following shape:
// {
//     local: {
//         addNewData ?: (data: any) => void;
//         updateExistingData ?: (id: string | number, data: any) => void;
//         deleteExistingData ?: (id: string | number) => void;
//     },
//     remote: {
//         insertFn ?: (data: any) => Promise<any>;
//         updateFn ?: (id: string | number, data: any) => Promise<void>;
//         deleteFn ?: (id: string | number) => Promise<void>;
//     }
// }

// local: Local State Update Functions: These are synchronous functions meant to update the local (client-side) state after a mutation succeeds remotely.
// remote: Remote Service Functions: These are asynchronous functions that perform the actual network requests.
