import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Youtube, BookOpen, PlayCircle, Book } from "lucide-react";
import clsx from 'clsx';
import EbookViewer from './components/EbookViewer';
import { YOUTUBE_API_KEY } from './config/keys';

const CHANNEL_HANDLE = "@SanatanaKathaAI";
const BRAND = {
  name: "sanatanaAI",
  tagline: "Stories, shlokas, and satsang — powered by AI",
  youtubeChannelUrl: `https://www.youtube.com/${CHANNEL_HANDLE}`,
  contactUrl: "mailto:you@example.com",
};

const SECTIONS = {
  VIDEOS: 'videos',
  STORIES: 'stories'
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[''"""–—]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function App() {
  const [videos, setVideos] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeSection, setActiveSection] = useState(SECTIONS.VIDEOS);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${CHANNEL_HANDLE}&type=channel&key=${YOUTUBE_API_KEY}`
        );
        const channelData = await channelRes.json();
        const channelId = channelData.items[0].id.channelId;

        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=3&order=date&type=video&key=${YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        const items = data.items.map((i) => ({
          videoId: i.id.videoId,
          title: i.snippet.title,
          description: i.snippet.description || "",
          thumbnail: i.snippet.thumbnails.high.url,
          slug: slugify(i.snippet.title),
        }));
        setVideos(items);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">{BRAND.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveSection(SECTIONS.VIDEOS)}
                className={clsx(
                  "px-4 py-2 rounded-md flex items-center space-x-2",
                  activeSection === SECTIONS.VIDEOS ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <PlayCircle size={20} />
                <span>Videos</span>
              </button>
              <button
                onClick={() => setActiveSection(SECTIONS.STORIES)}
                className={clsx(
                  "px-4 py-2 rounded-md flex items-center space-x-2",
                  activeSection === SECTIONS.STORIES ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Book size={20} />
                <span>Stories</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">{BRAND.tagline}</h2>

        {activeSection === SECTIONS.VIDEOS && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, idx) => (
              <motion.div
                key={video.videoId}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeSection === SECTIONS.STORIES && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="max-w-4xl mx-auto">
              <EbookViewer />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}