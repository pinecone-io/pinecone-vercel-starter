import React from 'react';
import { Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface RecursiveSplittingOptionsProps {
    chunkSize: number;
    setChunkSize: (value: number) => void;
    overlap: number;
    setOverlap: (value: number) => void;
    openChunkSizePopover: boolean;
    setOpenChunkSizePopover: (value: boolean) => void;
    openOverLapPopover: boolean;
    setOpenOverLapPopover: (value: boolean) => void;
}

export const RecursiveSplittingOptions: React.FC<RecursiveSplittingOptionsProps> = ({
    chunkSize,
    setChunkSize,
    overlap,
    setOverlap,
    openChunkSizePopover,
    setOpenChunkSizePopover,
    openOverLapPopover,
    setOpenOverLapPopover
}) => {
    const chunkSizePopoverTriggers = {
        onMouseEnter: () => setOpenChunkSizePopover(true),
        onMouseLeave: () => setOpenChunkSizePopover(false),
    };

    const overLapPopoverTriggers = {
        onMouseEnter: () => setOpenOverLapPopover(true),
        onMouseLeave: () => setOpenOverLapPopover(false),
    };

    return (
        <div className="w-full">
            <div className="my-4 flex flex-col">
                <div className="flex flex-col w-full">
                    <div className="flex gap-1">
                        <span>Chunk Size: </span><span className="font-bold">{chunkSize}</span><span>
                            <div>
                                <Popover open={openChunkSizePopover} handler={setOpenChunkSizePopover} placement="left">
                                    <PopoverHandler {...chunkSizePopoverTriggers}>
                                        <div><IoMdInformationCircleOutline className="text-[#72788D] mt-1 text-lg" /></div>
                                    </PopoverHandler>
                                    <PopoverContent {...chunkSizePopoverTriggers} className="z-50 max-w-[24rem]" placeholder="">
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            Chunk size in recursive text splitting is the user defined portion of text that&apos;s divided and processed in each recursion step, influencing the accuracy of the operation.
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </span>
                    </div>

                    <input
                        className="p-2"
                        type="range"
                        id="chunkSize"
                        min={1}
                        max={2048}
                        onChange={(e) => setChunkSize(parseInt(e.target.value))}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-1">
                        <span>Overlap:</span><span className="font-bold">{overlap}</span><span>
                            <div>
                                <Popover open={openOverLapPopover} handler={setOpenOverLapPopover} placement="left">
                                    <PopoverHandler {...overLapPopoverTriggers}>
                                        <div><IoMdInformationCircleOutline className="text-[#72788D] mt-1 text-lg" /></div>
                                    </PopoverHandler>
                                    <PopoverContent {...overLapPopoverTriggers} className="z-50 max-w-[24rem]" placeholder="">
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            Overlap in recursive text splitting is the user-specified section of text that&apos;s intentionally repeated across chunks to maintain context and potentially enhance accuracy.
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </span>
                    </div>
                    <input
                        className="p-2"
                        type="range"
                        id="overlap"
                        min={1}
                        max={200}
                        onChange={(e) => setOverlap(parseInt(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};