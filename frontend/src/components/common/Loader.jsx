const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-12 h-12 border-3',
        lg: 'w-16 h-16 border-4',
    };

    const loader = (
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-primary border-t-transparent`}></div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {loader}
            </div>
        );
    }

    return loader;
};

export default Loader;
