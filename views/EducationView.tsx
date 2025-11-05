
import React, { useState, useMemo } from 'react';
import { EducationalContent } from '../types';
import { BookOpen, Info, Search, Filter, CheckCircle } from '../components/icons';

interface EducationViewProps {
  content: EducationalContent[];
  onReadMore: (content: EducationalContent) => void;
}

const EducationView: React.FC<EducationViewProps> = ({ content, onReadMore }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => ['All', ...new Set(content.map(c => c.category))], [content]);

  const filteredContent = useMemo(() => {
    return content.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
                            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [content, searchTerm, selectedCategory]);

  const featuredArticle = filteredContent[0];
  const otherArticles = filteredContent.slice(1);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Health Education Center</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Empowering you with knowledge to keep children safe and healthy.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles by keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-slate-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="flex-grow flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredContent.length > 0 ? (
        <div className="space-y-8">
            {featuredArticle && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border dark:border-slate-700 flex flex-col md:flex-row overflow-hidden group">
                    <div className="md:w-1/2 p-6 flex flex-col justify-center">
                         <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium mb-3 self-start">{featuredArticle.category}</span>
                         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{featuredArticle.title}</h3>
                         <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{featuredArticle.content.substring(0, 150)}...</p>
                         <div className="flex items-center justify-between mt-auto">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{featuredArticle.readTime}</span>
                            <button 
                                onClick={() => onReadMore(featuredArticle)}
                                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                                Read More
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 bg-purple-50 dark:bg-slate-700/50 flex flex-col justify-center p-8 group-hover:bg-purple-100 dark:group-hover:bg-slate-700 transition-colors">
                        {featuredArticle.keyPoints ? (
                          <>
                            <h4 className="font-semibold text-lg mb-4 text-purple-800 dark:text-purple-300">In This Article, You'll Learn:</h4>
                            <ul className="space-y-3 text-purple-700 dark:text-purple-300">
                                {featuredArticle.keyPoints.map((point, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-purple-500 dark:text-purple-400 mr-3 mt-0.5 flex-shrink-0"/>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                          </>
                        ) : (
                          <BookOpen className="w-24 h-24 text-purple-300 dark:text-purple-500" />
                        )}
                    </div>
                </div>
            )}
            
            {otherArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {otherArticles.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6 flex flex-col hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                            </div>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded-full font-medium">{item.category}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex-grow">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{item.content.substring(0, 100)}...</p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{item.readTime}</span>
                            <button 
                            onClick={() => onReadMore(item)}
                            className="px-4 py-2 bg-purple-600/80 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                            >
                            Read More
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-300 rounded-full mx-auto flex items-center justify-center">
            <Info className="w-8 h-8" />
          </div>
          <h4 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">No Articles Found</h4>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EducationView;