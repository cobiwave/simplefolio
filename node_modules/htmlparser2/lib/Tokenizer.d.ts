/** All the states the tokenizer can be in. */
declare const enum State {
    Text = 1,
    BeforeTagName = 2,
    InTagName = 3,
    InSelfClosingTag = 4,
    BeforeClosingTagName = 5,
    InClosingTagName = 6,
    AfterClosingTagName = 7,
    BeforeAttributeName = 8,
    InAttributeName = 9,
    AfterAttributeName = 10,
    BeforeAttributeValue = 11,
    InAttributeValueDq = 12,
    InAttributeValueSq = 13,
    InAttributeValueNq = 14,
    BeforeDeclaration = 15,
    InDeclaration = 16,
    InProcessingInstruction = 17,
    BeforeComment = 18,
    CDATASequence = 19,
    InSpecialComment = 20,
    InCommentLike = 21,
    BeforeSpecialS = 22,
    SpecialStartSequence = 23,
    InSpecialTag = 24,
    BeforeEntity = 25,
    BeforeNumericEntity = 26,
    InNamedEntity = 27,
    InNumericEntity = 28,
    InHexEntity = 29
}
export interface Callbacks {
    onattribdata(value: string): void;
    onattribend(quote: string | undefined | null): void;
    onattribname(name: string): void;
    oncdata(data: string): void;
    onclosetag(name: string): void;
    oncomment(data: string): void;
    ondeclaration(content: string): void;
    onend(): void;
    onerror(error: Error, state?: State): void;
    onopentagend(): void;
    onopentagname(name: string): void;
    onprocessinginstruction(instruction: string): void;
    onselfclosingtag(): void;
    ontext(value: string): void;
}
export default class Tokenizer {
    private readonly cbs;
    /** The current state the tokenizer is in. */
    private _state;
    /** The read buffer. */
    private buffer;
    /** The beginning of the section that is currently being read. */
    sectionStart: number;
    /** The index within the buffer that we are currently looking at. */
    private _index;
    /**
     * Data that has already been processed will be removed from the buffer occasionally.
     * `_bufferOffset` keeps track of how many characters have been removed, to make sure position information is accurate.
     */
    private bufferOffset;
    /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
    private baseState;
    /** For special parsing behavior inside of script and style tags. */
    private isSpecial;
    /** Indicates whether the tokenizer has been paused. */
    private running;
    /** Indicates whether the tokenizer has finished running / `.end` has been called. */
    private ended;
    private readonly xmlMode;
    private readonly decodeEntities;
    private readonly entityTrie;
    constructor({ xmlMode, decodeEntities, }: {
        xmlMode?: boolean;
        decodeEntities?: boolean;
    }, cbs: Callbacks);
    reset(): void;
    write(chunk: string): void;
    end(chunk?: string): void;
    pause(): void;
    resume(): void;
    /**
     * The start of the current section.
     */
    getAbsoluteSectionStart(): number;
    /**
     * The current index within all of the written data.
     */
    getAbsoluteIndex(): number;
    private stateText;
    private currentSequence;
    private sequenceIndex;
    private stateSpecialStartSequence;
    /** Look for an end tag. For <title> tags, also decode entities. */
    private stateInSpecialTag;
    private stateCDATASequence;
    /**
     * When we wait for one specific character, we can speed things up
     * by skipping through the buffer until we find it.
     *
     * @returns Whether the character was found.
     */
    private fastForwardTo;
    /**
     * Comments and CDATA end with `-->` and `]]>`.
     *
     * Their common qualities are:
     * - Their end sequences have a distinct character they start with.
     * - That character is then repeated, so we have to check multiple repeats.
     * - All characters but the start character of the sequence can be skipped.
     */
    private stateInCommentLike;
    /**
     * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
     *
     * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
     * We allow anything that wouldn't end the tag.
     */
    private isTagStartChar;
    private startSpecial;
    private stateBeforeTagName;
    private stateInTagName;
    private stateBeforeClosingTagName;
    private stateInClosingTagName;
    private stateAfterClosingTagName;
    private stateBeforeAttributeName;
    private stateInSelfClosingTag;
    private stateInAttributeName;
    private stateAfterAttributeName;
    private stateBeforeAttributeValue;
    private handleInAttributeValue;
    private stateInAttributeValueDoubleQuotes;
    private stateInAttributeValueSingleQuotes;
    private stateInAttributeValueNoQuotes;
    private stateBeforeDeclaration;
    private stateInDeclaration;
    private stateInProcessingInstruction;
    private stateBeforeComment;
    private stateInSpecialComment;
    private stateBeforeSpecialS;
    private trieIndex;
    private trieCurrent;
    private trieResult;
    private entityExcess;
    private stateBeforeEntity;
    private stateInNamedEntity;
    private emitNamedEntity;
    private stateBeforeNumericEntity;
    private decodeNumericEntity;
    private stateInNumericEntity;
    private stateInHexEntity;
    private allowLegacyEntity;
    /**
     * Remove data that has already been consumed from the buffer.
     */
    private cleanup;
    private shouldContinue;
    /**
     * Iterates through the buffer, calling the function corresponding to the current state.
     *
     * States that are more likely to be hit are higher up, as a performance improvement.
     */
    private parse;
    private finish;
    /** Handle any trailing data. */
    private handleTrailingData;
    private getSection;
    private emitPartial;
}
export {};
//# sourceMappingURL=Tokenizer.d.ts.map