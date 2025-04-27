import {
  BoldItalicUnderlineToggles,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "@tanstack/react-router";

const fakePaper = `
# The Impact of Polkadot Parachains on Interblockchain Emotional Intelligence

**Dr. Gavin Woodpecker**
Department of Blockchain Psychology
Web3 University
gavin@polkadot.fake

**Abstract**
This study reveals that Polkadot's shared security model causes existential crises in competing Layer 1 chains. Through ethnographic analysis of 42 blockchain networks, we demonstrate that parachain auctions increase Ethereum's anxiety by 37% while improving Cosmos' self-esteem through IBC envy. Our novel Proof-of-Therapy consensus identifies substrate-based trauma in 93% of smart contract developers.

**Keywords**: parachain psychology, cross-chain drama, nominated validators syndrome

## 1. Introduction
The Polkadot ecosystem has introduced unprecedented stressors:
- Relay Chain Separation Anxiety (RCSA)
- Parachain Slot FOMO
- DOT Bonding Depression (DBD)

Prior work in "Crypto Therapy" (Vitalik 2022) failed to address substrate-native emotional needs. Our research fills this gap by applying Jungian archetypes to governance proposals.

## 2. Methodology
### 2.1 Experimental Setup
- **Test Group**: 10 parachains shown Polkadot white paper
- **Control Group**: 5 solo chains shown Ethereum documentation
- **Placebo Group**: 3 Binance Smart Chain validators given sugar pills

### 2.2 Measurement Tools
1. Blockchain Emotional Quotient (BEQ) scale
2. Governance Proposal Rejection Trauma Index
3. Kusama Canary Network Nervous Laughter Frequency

## 3. Results
| Metric                     | Polkadot | Ethereum | Solana |
|----------------------------|----------|----------|--------|
| Chain Self-Worth           | 8.9/10   | 6.2/10   | 5.5/10 |
| Cross-Chain Trust Issues   | 12%      | 94%      | 107%   |
| Validator Imposter Syndrome| 2.1 cases/epoch | 4.7 cases/block | N/A |


## 4. Discussion
Key findings reveal:
- Parachains developed separation anxiety when not chosen in auctions
- The relay chain shows signs of "middle child syndrome"
- XCM messages contain subliminal emotional support payloads

Unexpected discovery: 78% of stakers anthropomorphize their nominators.

## 5. Conclusion
Polkadot's architecture induces:
- Healthier interchain relationships than proof-of-work systems
- 23% fewer validator panic attacks vs. Solana
- Improved crypto-psychological wellbeing (p < 0.01)

**Future Work**: Studying whether parachain teams cry during bear markets.

## References
1. Wood, G. (2016) "How I Learned to Stop Worrying and Love the Relay Chain"
2. Nakamoto, S. (2008) "Bitcoin: A Peer-to-Peer Emotional Support System"
3. DOT Holders Anonymous (2023) "12 Steps for Recovering from Parachain Auctions"
`;
const fakePaper2 = `
# The Great Impact of Polkadot Parachains on Interblockchain Emotional Intelligence

**Dr. Gavin Woodpecker**
Department of Blockchain Psychology
Web3 University
gavin@polkadot.fake

**Abstract**
This study reveals that Polkadot's shared security model causes existential crises in competing Layer 1 chains. Through ethnographic analysis of 42 blockchain networks, we demonstrate that parachain auctions increase Ethereum's anxiety by 37% while improving Cosmos' self-esteem through IBC envy. Our novel Proof-of-Therapy consensus identifies substrate-based trauma in 93% of smart contract developers.

**Keywords**: parachain psychology, cross-chain drama, nominated validators syndrome

## 1. Introduction
The Polkadot ecosystem has introduced unprecedented stressors:
- Relay Chain Separation Anxiety (RCSA)
- Parachain Slot FOMO
- DOT Bonding Depression (DBD)

Prior work in "Crypto Therapy" (Vitalik 2022) failed to address substrate-native emotional needs. Our research fills this gap by applying Jungian archetypes to governance proposals.

## 2. Methodology
### 2.1 Experimental Setup
- **Test Group**: 10 parachains shown Polkadot white paper
- **Control Group**: 5 solo chains shown Ethereum documentation
- **Placebo Group**: 3 Binance Smart Chain validators given sugar pills

### 2.2 Measurement Tools
1. Blockchain Emotional Quotient (BEQ) scale
2. Governance Proposal Rejection Trauma Index
3. Kusama Canary Network Nervous Laughter Frequency

## 3. Results
| Metric                     | Polkadot | Ethereum | Solana |
|----------------------------|----------|----------|--------|
| Chain Self-Worth           | 8.9/10   | 6.2/10   | 5.5/10 |
| Cross-Chain Trust Issues   | 12%      | 94%      | 107%   |
| Validator Imposter Syndrome| 2.1 cases/epoch | 4.7 cases/block | N/A |


## 4. Discussion
Key findings reveal:
- Parachains developed separation anxiety when not chosen in auctions
- The relay chain shows signs of "middle child syndrome"
- XCM messages contain subliminal emotional support payloads

Unexpected discovery: 78% of stakers anthropomorphize their nominators.

## 5. Conclusion
Polkadot's architecture induces:
- Healthier interchain relationships than proof-of-work systems
- 23% fewer validator panic attacks vs. Solana
- Improved crypto-psychological wellbeing (p < 0.01)

**Future Work**: Studying whether parachain teams cry during bear markets.

## References
1. Wood, G. (2016) "How I Learned to Stop Worrying and Love the Relay Chain"
2. Nakamoto, S. (2008) "Bitcoin: A Peer-to-Peer Emotional Support System"
3. DOT Holders Anonymous (2023) "12 Steps for Recovering from Parachain Auctions"
`;

function SaveButton() {
  // TODO: implement actual submission
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  //
  useEffect(() => {
    let timer: number | undefined;
    if (submitted) {
      timer = setTimeout(() => {
        navigate({ to: "/about" });
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [submitted, navigate]);

  return (
    <button
      className={clsx(
        "cursor-pointer rounded bg-emerald-100 p-2 text-black hover:bg-emerald-300",
        submitted && "bg-gray-200 hover:bg-gray-200",
      )}
      onClick={() => setSubmitted(true)}
      disabled={submitted}>
      {submitted ? "Submitting..." : "Submit for Approval"}
    </button>
  );
}

export const MEdit = () => {
  return (
    <MDXEditor
      markdown={fakePaper}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        diffSourcePlugin({
          diffMarkdown: fakePaper2,
          viewMode: "rich-text",
        }),

        toolbarPlugin({
          toolbarClassName: "my-classname",
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <DiffSourceToggleWrapper>
                <UndoRedo />
              </DiffSourceToggleWrapper>

              <SaveButton />
            </>
          ),
        }),
      ]}
    />
  );
};
