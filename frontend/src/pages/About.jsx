import React from 'react';
import { Info, ShieldAlert, Award, FileText, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider uppercase">
          <Info className="h-4.5 w-4.5" />
          <span>Research overview</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          About ClinAI Framework
        </h1>
        <p className="text-slate-450 text-sm mt-1">
          A Hybrid BioClinicalBERT-GAT Clinical Disease Prediction Prototype.
        </p>
      </div>

      {/* Disclaimer - REQUIRED */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex gap-3 text-xs leading-relaxed text-amber-400">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
        <div>
          <h4 className="font-bold uppercase tracking-wider font-mono">Strict Clinical Disclaimer</h4>
          <p className="mt-1 font-semibold text-amber-300">
            This system is intended for educational and research purposes only. It is not a medical diagnosis tool and should not replace evaluation by a qualified healthcare professional.
          </p>
        </div>
      </div>

      {/* Project Objective */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-400" />
          <span>Project Objective & Pipeline</span>
        </h3>
        
        <div className="space-y-4 text-slate-350 text-sm leading-relaxed">
          <p>
            The ClinAI framework addresses two significant challenges in clinical NLP pipelines: 
            <strong> relational context modeling</strong> and <strong>prediction credibility calibration</strong>. 
            By merging context-aware language models with topological neural convolvers, we create a collaborative predictions network.
          </p>
          <p>
            The architecture is composed of four critical methodologies:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
            <li>
              <strong className="text-indigo-400">BioClinicalBERT Model</strong>: A transformer model pre-trained on large English clinical texts (MIMIC-III notes), extracting context-heavy vectors from clinical case descriptions.
            </li>
            <li>
              <strong className="text-indigo-400">Graph Attention Network (GAT)</strong>: Convolves dynamic patient-symptom relationships using multi-head attention weights to enrich topological descriptors.
            </li>
            <li>
              <strong className="text-indigo-400">Confidence Calibration</strong>: Implements Temperature Scaling to align output softmax probabilities with true empirical disease frequencies.
            </li>
            <li>
              <strong className="text-indigo-400">Explainable AI (XAI)</strong>: Highlights driving tokens using Integrated Gradients (Captum) and displays bipartite neural message flows via GAT attention weights.
            </li>
          </ul>
        </div>
      </div>

      {/* Academic Citation Reference */}
      <div className="glass-panel p-6 rounded-xl space-y-3">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-450" />
          <span>Research Foundations & References</span>
        </h3>
        <div className="text-xs font-mono text-slate-450 space-y-2.5 divide-y divide-slate-905">
          <div className="pb-2">
            <span className="text-indigo-400">[1]</span> Alsentzer et al., "Publicly Available Clinical BERT Embeddings", Clinical NLP Workshop 2019.
          </div>
          <div className="pt-2 pb-2">
            <span className="text-indigo-400">[2]</span> Veličković et al., "Graph Attention Networks", ICLR 2018.
          </div>
          <div className="pt-2">
            <span className="text-indigo-400">[3]</span> Guo et al., "On Calibration of Modern Neural Networks", ICML 2017.
          </div>
        </div>
      </div>
    </div>
  );
}
