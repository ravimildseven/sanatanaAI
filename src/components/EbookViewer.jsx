import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function EbookViewer({ videoTitle }) {
  const [currentPage, setCurrentPage] = React.useState(0);

  const pages = [
    {
      title: 'साधना संग्रह',
      subtitle: '॥ श्री गणेशाय नमः ॥',
      content: [
        {
          sanskrit: 'यद्वाचो निःसृतं शास्त्रं यद्वाचः श्रुतिसम्मतम्।\nतद्वाचो गुरुमूलं हि तस्मै श्रीगुरवे नमः॥',
          english: 'The scriptures that emerge from speech, the knowledge that is in harmony with the Vedas - their root lies in the words of the Guru. I bow to that revered Guru.'
        }
      ]
    },
    {
      title: 'Chapter One',
      subtitle: 'अथ प्रथमोऽध्यायः',
      content: [
        {
          sanskrit: 'गुरुब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः।\nगुरुः साक्षात् परब्रह्म तस्मै श्रीगुरवे नमः॥',
          english: 'Guru is Brahma, Guru is Vishnu, Guru is Lord Maheshwara. Guru is verily the Supreme Brahman. Salutations to that Guru.'
        }
      ]
    }
  ];

  const page = pages[currentPage];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 ring-1 ring-gray-900/5 shadow-lg">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-8 shadow-inner min-h-[70vh] relative"
      >
        <div className="max-w-2xl mx-auto">
          {/* Page Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{page.title}</h1>
            <div className="text-2xl mb-4 text-gray-700">{page.subtitle}</div>
            <div className="h-px w-24 mx-auto bg-orange-200 mb-8"></div>
          </div>

          <div className="prose prose-lg prose-orange mx-auto">
            {page.content.map((section, idx) => (
              <div key={idx} className="mb-12">
                <p className="text-xl leading-relaxed mb-6 font-sanskrit text-gray-800">
                  {section.sanskrit.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <p className="text-gray-600 leading-relaxed italic">
                  {section.english}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage + 1} of {pages.length}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
            disabled={currentPage === pages.length - 1}
            className="p-2 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
